import axios from 'axios'

const MyHttpServer = {}
MyHttpServer.install = (Vue) => {
  // 统一配置基准地址
  axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'
  // 添加实例方法
  Vue.prototype.$http = axios
}
//  导出
export default MyHttpServer
