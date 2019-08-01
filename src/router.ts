import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

// import Home from '@/views/Home.vue';
// import About from '@/views/About.vue';
// import Question from '@/views/Question.vue';
// import PostView from '@/views/PostView.vue';
// import PostEdit from '@/views/PostEdit.vue';
// import Submit from '@/views/Submit.vue';
// import Challenge from '@/views/Challenge.vue';
// import Version from '@/views/Version.vue';
// import Personal from '@/views/Personal.vue';
// import PersonalProfile from '@/views/PersonalProfile.vue';
// import PersonalPosts from '@/views/PersonalPosts.vue';

export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {path: '/', redirect: '/home'},
    // 这种写法会导致 mounted 的时候获取不到正确的 $route 参数
    // component: () => import('@/views/Home.vue'),
    {path: '/home', name: 'home', component: () => import('@/views/Home.vue')},
    {path: '/sites', name: 'sites', component: () => import('@/views/OJSiteList.vue')},
    {path: '/site/:id', name: 'site_detail', component: () => import('@/views/OJSiteDetail.vue')},
    {path: '/about', name: 'about', component: () => import('@/views/About.vue')},
    {path: '/question', name: 'question', component: () => import('@/views/Question.vue')},
    {path: '/submit', name: 'submit', component: () => import('@/views/Submit.vue')},
    {path: '/challenge', name: 'challenge', component: () => import('@/views/Challenge.vue')},
    {path: '/post/:id', name: 'post_view', component: () => import('@/views/PostView.vue')},
    {path: '/post/edit/:id', name: 'post_edit', component: () => import('@/views/PostEdit.vue')},
    {path: '/version', name: 'version', component: () => import('@/views/Version.vue')},
    {path: '/problems', name: 'problem_list', component: () => import('@/views/ProblemList.vue')},
    {path: '/problem/:id', name: 'problem_view', component: () => import('@/views/ProblemView.vue')},
    {path: '/problem/:oj/:num', name: 'problem_view_num', component: () => import('@/views/ProblemView.vue')},
    {
      path: '/personal',
      name: 'personal',
      component: () => import('@/views/Personal.vue'),
      redirect: '/personal/profile',
      children: [
        {path: '/personal/profile', name: 'personal_profile', component: () => import('@/views/PersonalProfile.vue')},
        {path: '/personal/posts', name: 'personal_posts', component: () => import('@/views/PersonalPosts.vue')},
      ],
    },
  ],
});
