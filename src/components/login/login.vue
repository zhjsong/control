<template>
<div  class="login-wrap">
 <el-form
 class="login-form"
 label-position="top"
 label-width="80px"
 :model="formdata">
 <h2>用户登录</h2>
  <el-form-item label="用户名">
    <el-input v-model="formdata.username"></el-input>
  </el-form-item>
  <el-form-item label="密码">
    <el-input v-model="formdata.password"></el-input>
  </el-form-item>
  <el-button type="primary" class="login-btn" @click.prevent='handleLogin()'>登录</el-button>
 </el-form>
</div>
</template>
<script>
export default {
  data () {
    return {
      formdata: {
        username: '',
        password: ''
      }
    }
  },
  methods: {
    async handleLogin () {
      const res = await this.$http.post('login', this.formdata)

      console.log(res)
      // 解构赋值
      const {meta: {msg, status}, data} = res.data
      if (status === 200) {
        // 保存用户的token值.在后面页面中可以判断token值
        const token = localStorage.setItem('token', data.token)
        this.$router.push({name: 'home'})
        this.$message.success(msg)
      } else {
        this.$message.warning(msg)
      }
    }
  }
}

</script>
<style>
.login-wrap {
  height: 100%;
  background-color: #324152;
  display: flex;
  justify-content: center;
  align-items: center;

}
.login-wrap .login-form{
    background-color: #fff;
    width: 400px;
    border-radius: 5px;
    padding: 30px;
}
.login-wrap .login-btn{
     width: 100%;
}
</style>
