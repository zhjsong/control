
<template>
    <el-card class="box-card">
 <el-breadcrumb separator-class="el-icon-arrow-right">
   <el-breadcrumb-item>首页</el-breadcrumb-item>
   <el-breadcrumb-item>用户管理</el-breadcrumb-item>
   <el-breadcrumb-item>用户列表</el-breadcrumb-item>
 </el-breadcrumb>
   <el-row class="seachRow">
       <el-col :span='16'>
           <el-input clearable v-model='query' placeholder="请输入内容"  class="seachInput">
           <el-button  @click='searchUser()' slot="append" icon="el-icon-search"></el-button>
          </el-input>
           <el-button type="primary" @click="addForm()">添加用户</el-button>
       </el-col>
   </el-row>
   <!-- 表格 -->
    <el-table
      :data="userlist"
      style="width: 100%">
      <el-table-column
        type="index"
        label="#"
        width="80">
      </el-table-column>
      <el-table-column
        prop="username"
        label="姓名"
        width="180">
      </el-table-column>
      <el-table-column
        prop="email"
        label="邮箱">
      </el-table-column>
       <el-table-column
        prop=" mobile"
        label="电话">
      </el-table-column>
       <el-table-column
        prop="create_time"
        label="创建日期">
        <template slot-scope="scope">
            {{scope.row.create_time | formart}}
        </template>
      </el-table-column>

      <el-table-column label="用户状态">
        <template slot-scope="scope">
          <el-switch
            @change="changeUserMgstate(scope.row)"
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </template>
      </el-table-column>

         <el-table-column
        prop= "operate"
        label="操作">
        <template slot-scope="scope">
            <el-button @click='edite(scope.row)' size='mini' plain  type="primary" icon="el-icon-edit" circle></el-button>
            <el-button @click='dele(scope.row.id)' size='mini'  plain type="danger" icon="el-icon-delete" circle></el-button>
            <el-button   @click='setRole(scope.row)' size='mini'  plain type="success" icon="el-icon-check" circle></el-button>
        </template>
      </el-table-column>
    </el-table>
      <!-- 分页 -->
     <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="pagenum"
      :page-sizes="[2, 4, 6, 8]"
      :page-size="2"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!-- 对话框 -->
    <el-dialog title="添加用户" :visible.sync="dialogFormVisibleAdd">
  <el-form :model="form">
    <el-form-item label="用户名称" label-width="100px">
      <el-input v-model="form.username" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="密码" label-width="100px">
      <el-input v-model="form.password" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="邮箱" label-width="100px">
      <el-input v-model="form.email" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="电话" label-width="100px">
      <el-input v-model="form.mobile" autocomplete="off"></el-input>
    </el-form-item>

  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisibleAdd = false">取 消</el-button>
    <el-button type="primary" @click="addUser()">确 定</el-button>
  </div>
</el-dialog>
<!-- 编辑对话框 -->
   <el-dialog title="编辑用户" :visible.sync="dialogFormVisibleEdit">
  <el-form :model="form">
    <el-form-item label="用户名称" label-width="100px">
      <el-input :disabled="true" v-model="form.username" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="邮箱" label-width="100px">
      <el-input v-model="form.email" autocomplete="off"></el-input>
    </el-form-item>
    <el-form-item label="电话" label-width="100px">
      <el-input v-model="form.mobile" autocomplete="off"></el-input>
    </el-form-item>

  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisibleEdit = false">取 消</el-button>
    <el-button type="primary" @click="editUser()">确 定</el-button>
  </div>
</el-dialog>
<!-- 角色分配 -->
<el-dialog title="角色分配" :visible.sync="dialogFormVisibleRole">
  <el-form :model="form">
    <el-form-item label="用户名" label-width="100px">
     {{currUsername}}
    </el-form-item>
    <el-form-item label="角色" label-width="100px">
      <el-select v-model="currRoleId">
        <el-option label="请选择" :value="-1"></el-option>
        <el-option v-for='(item,i) in roles' :key='i' :label="item.roleName" :value="item.id"></el-option>

      </el-select>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisible = false">取 消</el-button>
    <el-button type="primary" @click="changeRole()">确 定</el-button>
  </div>
</el-dialog>
    </el-card>
</template>
<script>
export default {
  data () {
    return {
      query: '',
      userlist: [
        {
          create_time: '',
          email: '',
          id: '',
          mg_state: '',
          mobile: '',
          role_name: '',
          username: ''
        }
      ],
      pagenum: 1,
      pagesize: 2,
      total: -1,
      dialogFormVisibleAdd: false,
      dialogFormVisibleEdit: false,
      dialogFormVisibleRole: false,
      form: {
        username: '',
        password: '',
        email: '',
        mobile: ''
      },
      currUserId: -1,
      currUsername: '',
      currRoleId: -1,
      roles: []
    }
  },
  created () {
    this.getUserList()
  },
  methods: {
    // 修改角色id,发送请求
    async changeRole () {
      const res = await this.$http.put(`users/${this.currUserId}/role`, {
        r: this.currRoleId
      })
      console.log(res)
      this.dialogFormVisibleRole = false
    },
    // 分配角色
    async setRole (user) {
      // 获取当前角色名
      this.currUserId = user.id
      const res1 = await this.$http.get('roles')
      console.log(res1)
      this.roles = res1.data.data
      //  根据用户ID获取当前的角色id
      const res2 = await this.$http.get(`users/${user.id}`)
      console.log(res2)
      this.currRoleId = res2.data.data.rid
      // 获取当前用户名
      this.currUsername = user.username
      this.dialogFormVisibleRole = true
    },
    //  修改用户的状态
    async changeUserMgstate (user) {
      // users/:uId/state/:type
      const res = await this.$http.put(
        `users/${user.id}/state/${user.mg_state}`
      )
      console.log(res)
    },
    // 点击编辑确定按钮
    async editUser () {
      const res = await this.$http.put(`users/${this.form.id}`, this.form)
      //  console.log(res)
      const { meta: { msg, status }, data } = res.data
      if (status === 200) {
        this.$message.success(msg)
        this.dialogFormVisibleEdit = false
        this.getUserList()
      }
    },
    //   编辑按钮
    edite (user) {
      this.form = user
      this.dialogFormVisibleEdit = true
    },
    //   删除按钮
    dele (userId) {
      this.$confirm('是否删除该用户', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          // 发送请求
          const res = await this.$http.delete(`users/${userId}`)
          //  console.log(res)
          //  更新视图
          const { meta: { status, msg }, data } = res.data
          this.$message({
            type: 'success',
            message: msg
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: msg
          })
        })
    },
    //   点击确定按钮更新视图
    async addUser () {
      const res = await this.$http.post('users', this.form)
      console.log(res)
      const { meta: { status, msg }, data } = res.data
      //    1.关闭对话框
      this.dialogFormVisibleAdd = false
      //    2.视图
      if (status === 201) {
        this.$message.success(msg)
        this.getUserList()
        this.form = {}
      } else {
        this.$message.warning(msg)
      }
    },
    //   添加用户
    addForm () {
      this.form = {}
      this.dialogFormVisibleAdd = true
    },
    // 搜索功能
    searchUser () {
      this.pagenum = 1
      this.getUserList()
    },
    // 分页
    handleSizeChange (val) {
      console.log(`每页 ${val} 条`)
      this.pagesize = val
      this.getUserList()
      this.pagenum = 1
    },
    handleCurrentChange (val) {
      console.log(`当前页: ${val}`)
      this.pagenum = val
      this.getUserList()
    },
    async getUserList () {
      //    设置请求头
      const AUTH_TOKEN = localStorage.getItem('token')
      this.$http.defaults.headers.common['Authorization'] = AUTH_TOKEN
      const res = await this.$http.get(
        `users?query=${this.query}&pagenum=${this.pagenum}&pagesize=${
          this.pagesize
        }`
      )
      console.log(res)
      const { meta: { msg, status }, data: { total, users } } = res.data
      if (status === 200) {
        this.total = total
        this.userlist = users
        this.$message.success(msg)
      } else {
        this.$message.warning(msg)
      }
    }
  }
}
</script>
<style>
.seachRow {
  margin-top: 20px;
}
.seachInput {
  width: 300px;
}
</style>
