import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

import Home from '@/views/Home.vue';
import About from '@/views/About.vue';

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [{
    path: '/',
    redirect: '/home/',
  }, {
    path: '/home/',
    name: 'home',
    component: Home,
    // 这种写法会导致 mounted 的时候获取不到正确的 $route 参数
    // component: () => import('@/views/Home.vue'),
  }, {
    path: '/about/',
    name: 'about',
    component: About,
    // component: () => import('@/views/About.vue'),
  }],
});
