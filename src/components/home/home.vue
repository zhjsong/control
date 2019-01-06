<template>
  <el-container class="container">
    <el-header class="header">
        <el-row>
             <el-col :span="4">
                 <div class="grid-content bg-purple">
                     <img src="../../assets/logo.png" alt="">
                 </div></el-col>
             <el-col :span="19" class="middle">
                 <div class="grid-content bg-purple-light">
                    <h3>后台管理系统</h3>
                 </div>
            </el-col>
             <el-col :span="1" class="logout">
                 <div class="grid-content bg-purple">
                     <a href="#" @click.prevent='hanleloginout()'>退出</a>
                </div>
            </el-col>
     </el-row>
    </el-header>
    <el-container>
      <el-aside width="200px" class="aside">
           <el-menu
           :unique-opened='true'
           :router='true'
           class="el-menu-vertical-demo"
           >
      <el-submenu :index="''+item1.order" v-for='(item1,i) in menu' :key='i'>
        <template slot="title">
          <i class="el-icon-location"></i>
          <span>{{item1.authName}}</span>
        </template>

          <el-menu-item :index="item2.path" v-for='(item2,i) in item1.children' :key='i'>
              <template slot="title">
          <i class="el-icon-menu"></i>
          <span>{{item2.authName}}</span>
        </template>
          </el-menu-item>
      </el-submenu>
    </el-menu>
      </el-aside>
      <el-main class="main">
        <router-view></router-view>
      </el-main>
   </el-container>
 </el-container>
</template>
<script>
export default {
  // 在渲染之前,使用钩子函数
  // beforeCreate () {
  //   const token = localStorage.getItem('token')
  //   if (!token) {
  //     this.$router.push({name: 'login'})
  //   }
  // },
  data () {
    return {
      menu:[]
    }
  },
  created(){
      this.getMenuList()
  },
  methods: {
    // 左侧菜单栏进行封装
    async getMenuList(){
        const res=await this.$http.get('menus')
        console.log(res)
        this.menu=res.data.data
    },
    hanleloginout () {
      this.$message.success('退出成功')
      localStorage.clear()
      this.$router.push({name: 'login'})
    }
  }

}
</script>
<style>
.container {
  height: 100%;
}
.header {
  background: #b3c0d1;
}
.aside {
  background: #d3dce6;
}
.main {
  background: #e9eef3;
  height: 100%;
}
/* 头部样式调整 */
.middle {
    text-align: center;
}
.logout {
    line-height: 60px;
    text-decoration: none;

}
</style>
