import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '../components/Login.vue'
import home from '../components/Home.vue'
import welcome from '../components/Welcome.vue'

import user from '../components/user/User.vue'
import roles from '../components/roles.vue'
import rights from '../components/rights.vue'
import newpage  from '../components/newpage/newpage.vue'


Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login',
    hidden: true
  },
  {
    path: '/login',
    component: login,
    hidden: true
  },
  {
    path: '/home',
    name: 'home',
    component: home,
    redirect: '/welcome',
    children: [
      {
        path: '/welcome',
        name: 'welcome',
        component: welcome,
      },
      {
        path:'/users',
        component: user,
        name: 'users',
        meta: { title: '用户管理' }
      },
      {
        path:'/roles',
        component: roles,
        name: 'roles',
        meta: { title: '角色管理'}
      },
      {
        path:'/rights',
        component: rights,
        name: 'rights',
        meta: { title: '菜单管理'}
      },
      {
        path:'/newpage',
        component: newpage,
        name: 'newage',
        meta: { title: '新页面'}
      },
      {
        path:'/system',
        component: newpage,
        name: 'system',
        meta: { title: '系统管理'}
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

//路由导航守卫
router.beforeEach(function (to, from, next) {
  if (to.path === '/login') return next();
  const token = window.sessionStorage.getItem('token');
  if (!token) {
    return next('/login');
  }
  next();
});
export default router
