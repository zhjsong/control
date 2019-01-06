<template>
    <el-card class="box-card">
        <my-bread level1='权限管理' level2='权限列表'></my-bread>
        <!-- 表格 -->
        <el-table
        height="450px"
    class="rightTable"
    :data="rightlist"
    border
    style="width: 100%">
    <el-table-column
      type="index"
      label="#"
      width="180">
    </el-table-column>
    <el-table-column
      prop="authName"
      label="权限名称"
      width="180">
    </el-table-column>
    <el-table-column
      prop="path"
      label="路径">
    </el-table-column>
     <el-table-column
      prop="level"
      label="层级">
      <template slot-scope="scope">
        <span v-if="scope.row.level==='0'">一级</span>
        <span v-if="scope.row.level==='1'">二级</span>
        <span v-if="scope.row.level==='2'">三级</span>
      </template>
    </el-table-column>
  </el-table>
    </el-card>
</template>
<script>
export default {
    data(){
        return {
            rightlist:[]
        }
    },
    created(){
        this.getRightList()
    },
    methods:{
        async getRightList(){
            // 设置请求头
        //   const AUTH_TOKEN = localStorage.getItem("token");
        //   this.$http.defaults.headers.common["Authorization"] = AUTH_TOKEN;
        //   发送请求
          const res =await this.$http.get(`rights/list`)
          console.log(res)
          this.rightlist=res.data.data
        }
        
    }
}
</script>
<style>
   .rightTable{
       margin-top: 20px;
   }
</style>

