// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
// 导入elemenyui组件库123
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App'
import router from './router'
import MyHttpServer from '@/plugins/http.js'
import moment from 'moment'
// 样式文件
import '@/assets/css/index.css'

Vue.use(ElementUI)
Vue.use(MyHttpServer)
Vue.config.productionTip = false
// 时间过滤器
Vue.filter('formart', (v) => {
  return moment(v).format('YYYY-MM-DD')
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
