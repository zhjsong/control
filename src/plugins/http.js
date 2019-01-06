import axios from 'axios'

const MyHttpServer = {}
MyHttpServer.install = (Vue) => {
  // 统一配置基准地址
  axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
  // 添加请求拦截器
axios.interceptors.request.use(function (config) {
   console.log(config.url)
  if(config.url!=='login'){
    const AUTH_TOKEN = localStorage.getItem("token");
    config.headers["Authorization"] = AUTH_TOKEN;
  }
  // 在发送请求之前做些什么
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

  // 添加实例方法
  Vue.prototype.$http = axios
}
//  导出
export default MyHttpServer
