import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '../views/Home.vue'

const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location: any) {
  return (originalPush.call(this, location) as any).catch((err: any) => err)
}

Vue.use(VueRouter) 

const routes: Array<RouteConfig> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/post/:id',
    name: 'post',
    component: () => import(/* webpackChunkName: "about" */ '../views/Post.vue')
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/user',
    name: 'User',
    component: () => import('../views/Privicy.vue')
  },
  {
    path: '/star',
    name: 'Star',
    component: () => import('../views/Star.vue')
  },
  {
    path: '/history',
    name: 'History',
    component: () => import('../views/History.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  routes,
  scrollBehavior(to, from,savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})

export default router
