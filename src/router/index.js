import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home'
import Users from '@/components/user/Users'
import Roles from '@/components/roles/Roles.vue'
import Rights from '@/components/rights/Rights.vue'
import Goods from '@/components/goods/Goods.vue'
import Params from '@/components/params/Params.vue'
import Categories from '@/components/categories/Categories.vue'
import Orders from '@/components/orders/Orders.vue'
import Reports from '@/components/reports/Reports.vue'
import AddGoods from '@/components/goods/AddGoods.vue'
import Welcome from '@/components/Welcome.vue'
Vue.use(VueRouter)
const routes = [{
  path: '/',
  redirect: '/login'
}, {
  path: '/login',
  component: Login
}, {
  path: '/home',
  component: Home,
  redirect: '/welcome',
  children: [
    {
      path: '/welcome',
      component: Welcome
    },
    {
      path: '/users',
      component: Users
    },
    {
      path: '/roles',
      component: Roles
    },
    {
      path: '/rights',
      component: Rights
    },
    {
      path: '/goods',
      component: Goods
    },
    {
      path: '/params',
      component: Params
    },
    {
      path: '/categories',
      component: Categories
    },
    {
      path: '/orders',
      component: Orders
    },
    {
      path: '/reports',
      component: Reports
    },
    {
      path: '/addGoods',
      component: AddGoods
    }
  ]
}
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})
export default router
