import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

import Home from '@/views/Home.vue';
import About from '@/views/About.vue';
import Question from '@/views/Question.vue';
import PostView from '@/views/PostView.vue';
import PostEdit from '@/views/PostEdit.vue';
import Submit from '@/views/Submit.vue';
import Challenge from '@/views/Challenge.vue';
import Version from '@/views/Version.vue';

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {path: '/', redirect: '/home/'},
    // 这种写法会导致 mounted 的时候获取不到正确的 $route 参数
    // component: () => import('@/views/Home.vue'),
    {path: '/home/', name: 'home', component: Home},
    {path: '/about/', name: 'about', component: About},
    {path: '/question/', name: 'question', component: Question},
    {path: '/submit/', name: 'submit', component: Submit},
    {path: '/challenge/', name: 'challenge', component: Challenge},
    {path: '/post/:id/', name: 'post_view', component: PostView},
    {path: '/post/edit/:id/', name: 'post_edit', component: PostEdit},
    {path: '/version/', name: 'version', component: Version},
  ],
});
