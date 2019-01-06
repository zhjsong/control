<template>
   <el-card class="box-card">
       <my-bread level1='权限管理' level2='角色列表'></my-bread>
       <!-- 添加按钮 -->
       <el-row class="btn">
           <el-col>
               <el-button @click='addRoleRight()'>添加角色</el-button>
           </el-col>
       </el-row>

        <!-- 3. 表格 -->
    <el-table :data="rolelist" style="width: 100%">
      <el-table-column type="expand" width="80">
          <template slot-scope="scope">
              <el-row v-for="(item1,index) in scope.row.children" :key='index'>
                  <el-col :span='4'>
                      <el-tag  closable @close="deleRight(scope.row,item1.id)">{{item1.authName}}</el-tag>
                      <i class="el-icon-arrow-right"></i>
                  </el-col>
                  <el-col :span='20'>
                      <el-row v-for="(item2,index) in item1.children" :key='index'>
                          <el-col :span="4" >
                              <el-tag 
                               @close="deleRight(scope.row,item2.id)"
                               closable 
                               type="success">{{item2.authName}}</el-tag>
                               <i class="el-icon-arrow-right"></i>
                          </el-col>
                           <el-col :span="20">
                               <el-tag 
                                @close="deleRight(scope.row,item3.id)"
                               v-for="(item3,index) in item2.children" :key='index'  closable  type="danger">{{item3.authName}}</el-tag>
                                <i class="el-icon-arrow-right"></i>
                          </el-col>
                      </el-row>
                  </el-col>
              </el-row>
              <!-- 未分配权限 -->
              <el-row v-if="scope.row.children.length===0" class="posit">
                  <span>未分配权限</span>
              </el-row>
          </template>
      </el-table-column>
      <el-table-column type="index" label="#" width="80"></el-table-column>
      <el-table-column prop="roleName" label="角色名称" width="100"></el-table-column>
      <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            @click="showEditUserDia(scope.row)"
            size="mini"
            plain
            type="primary"
            icon="el-icon-edit"
            circle
          ></el-button>
          <el-button
            @click="deleRole(scope.row.id)"
            size="mini"
            plain
            type="danger"
            icon="el-icon-delete"
            circle
          ></el-button>
          <el-button
            size="mini"
            plain
            type="success"
            icon="el-icon-check"
            @click="showSetRightDia(scope.row)"
            circle
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分配或者修改权限对话框 -->
    <el-dialog title="分配权限" :visible.sync="dialogFormVisibleRight">
     <!-- 树形结构 -->
     <el-tree
        ref="tree"
        default-expand-all
        :data="treelist"
        show-checkbox
        :default-checked-keys="arrcheck"
        node-key="id"
        :props="defaultProps">
    </el-tree>      
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisibleRight = false">取 消</el-button>
    <el-button type="primary" @click="setRoleRight()">确 定</el-button>
  </div>
</el-dialog>
 <!-- 添加用户 -->
    <el-dialog title="添加角色" :visible.sync="dialogFormVisibleRoleRight">
  <el-form :model="form">
    <el-form-item label="角色名称" label-width="100px">
      <el-input v-model="form.roleName" autocomplete="off"></el-input>
    </el-form-item>
     <el-form-item label="角色描述" label-width="100px">
      <el-input v-model="form.roleDesc" autocomplete="off"></el-input>
    </el-form-item>
  </el-form>
  <div slot="footer" class="dialog-footer">
    <el-button @click="dialogFormVisibleRoleRight = false">取 消</el-button>
    <el-button type="primary" @click="addRoles()">确 定</el-button>
  </div>
</el-dialog>

   </el-card>
</template>
<script>
export default {
      data(){
        return {
            rolelist:[],
             dialogFormVisibleRight:false,
            //  树形结构
             treelist:[],
             defaultProps:{
                 children:'children',
                 label:'authName'
             },
            //  默认勾选的数组
            arrcheck:[],
            currRoleId:'',
            form:[{
                roleName:'',
                roleDesc:''
            }],
            dialogFormVisibleRoleRight:false
        }
    },
    created(){
        this.getRoleList()
    },
    methods:{
        // 删除按钮
       async deleRole(roleId){
       const res =await this.$http.delete(`roles/${roleId}`);
        this.getRoleList()
          
        },
        // 点击添加里面的确定按钮
        async addRoles(){
             const res =await this.$http.post('roles',this.form)
             console.log(res)
             const {meta:{msg,status},data}=res.data
             if(status===201){
                 this.getRoleList();
                 this.$message.success(msg)

             }else{
                 this.$message.warning(msg)
             }
              this.dialogFormVisibleRoleRight = false;
        },
        // 添加按钮
        async addRoleRight(){
              this.dialogFormVisibleRoleRight =true
              this.form={}
        },
        // 发送请求,更改权限内容
        async setRoleRight(){
          
            // 获取用户半选的id值
            let arr1=this.$refs.tree.getHalfCheckedKeys()
            console.log(arr1)
            let arr2=this.$refs.tree.getCheckedKeys()
            let arr=[...arr1,...arr2]
            console.log(arr)
              // 发送请求
            const res =await this.$http.post(`roles/${this.currRoleId}/rights`,{
                rids: arr.join(',')
            })
             this.dialogFormVisibleRight=false
             this.getRoleList()
        },
        async showSetRightDia(role){
            this.currRoleId=role.id
            console.log(role)
            // 获取权限列表展示给树形结构
            const res=await this.$http.get(`rights/tree`)
            console.log(res)
            this.treelist=res.data.data
            // 获取选中的角色数组
            let arrtemp=[]
            role.children.forEach(item1=>{
                 item1.children.forEach(item2=>{
                      item2.children.forEach(item3=>{
                       arrtemp.push(item3.id)
                 })
              })
            })
           this.arrcheck=arrtemp
           this.dialogFormVisibleRight=true;
        },
        // 删除权限
        async deleRight(role,itemId){
           const res=await this.$http.delete(`roles/${role.id}/rights/${itemId}`)
           console.log(res)
           role.children=res.data.data
        },
        async getRoleList(){
            // 设置请求头
        //   const AUTH_TOKEN = localStorage.getItem("token");
        //   this.$http.defaults.headers.common["Authorization"] = AUTH_TOKEN;
        //   发送请求
          const res =await this.$http.get('roles')
          console.log(res)
          this.rolelist=res.data.data
        }
        
    }
}
</script>
<style>
.btn {
    margin-top: 20px;
}
.posit{
    margin-left: 50%;
}
</style>
