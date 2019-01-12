import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/login/login.vue'
import Home from '@/components/home/home.vue'
import Users from '@/components/users/users.vue'
import Rights from '@/components/rights/rights.vue'
import Role from '@/components/role/role.vue'
import Goods from '@/components/goods/goodlist.vue'
import GoodsAdd from '@/components/goods/goodsadd.vue'
import Cateparams from '@/components/goods/cateparams.vue'
import Goodscate from '@/components/goods/goodscate.vue'
// 单独引入message
import { Message } from 'element-ui'

Vue.use(Router)

const router= new Router({
  routes: [
    {
      name: 'login',
      path: '/login',
      component: Login

    },
    {
      name: 'home',
      path: '/',
      component: Home,
      children: [
        {
          name: 'users',
          path: '/users',
          component: Users
        },
        {
          name: 'rights',
          path: '/rights',
          component:Rights
        },
        {
          name: 'roles',
          path: '/roles',
          component:Role
        },
        {
          name: 'goods',
          path: '/goods',
          component:Goods
        },
        {
          name: 'goodsadd',
          path: '/goodsadd',
          component:GoodsAdd
        },
        {
          name: 'params',
          path: '/params',
          component:Cateparams
        },
        {
          name: 'categories',
          path: '/categories',
          component: Goodscate
        }
      ]
    }
  ]
})
// 路由守卫
router.beforeEach((to, from, next) => {
  if(to.path==='/login'){
    next()
  }else {
    const token = localStorage.getItem('token')
    if (!token) {
      Message.success('回到登录')
      router.push({name: 'login'})
      return
  }
    next()
  }
})
export default router
