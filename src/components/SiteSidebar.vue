<template>
  <div class="site-sidebar">
    <div class="sidebar-block block-categories">
      <h3 class="title">题目分类</h3>
      <ul class="item-list">
        <li v-for="category in categories">
          <a href="javascript:" @click="routeToCategory(category)">
            {{category.name}} ({{category.post_count}})
          </a>
        </li>
      </ul>
    </div>
    <div class="sidebar-block block-oj-sites">
      <h3 class="title">OnlineJudge 支持</h3>
      <ul class="item-list">
        <li v-for="ojSite in onlineJudgeSites">
          <a :href="ojSite.homepage" target="_blank">{{ojSite.name}}</a>
        </li>
      </ul>
    </div>
    <div class="sidebar-block block-last-members">
      <h3 class="title">最近访客</h3>
      <ul class="item-list">
        <li v-for="member in lastLoginMembers">
          <a><img :src="member.avatar_url"/></a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
  import {Component} from 'vue-property-decorator';
  import VueBase from '../classes/vue/VueBase';
  import ProblemCategory from '../classes/models/ProblemCategory';
  import OnlineJudgeSite from '../classes/models/OnlineJudgeSite';
  import Member from '../classes/models/Member'

  @Component
  export default class SiteSidebar extends VueBase {
    public categories: ProblemCategory[] = [];
    public onlineJudgeSites: OnlineJudgeSite[] = [];
    public lastLoginMembers: Member[] = [];

    public routeToCategory(category: ProblemCategory) {
      const vm = this;
      // <router-link :to="{name: 'home', query:{categories__id:category.id}}">
      //   {{category.name}}</router-link>
      vm.$router.push({
        name: 'home',
        query: {categories__id: category.id.toString()},
        replace: vm.$route.name === 'home',
      });
    }

    private async mounted() {
      const vm = this;
      let resp: any;
      // 读取分类列表
      resp = await vm.api('problem_category').get({}, {page_size: 20, ordering: '-post_count'});
      vm.categories = resp.data.results.map((item: any) => new ProblemCategory(item));
      // 读取OJ列表
      resp = await vm.api('online_judge_site').get({}, {page_size: 0});
      vm.onlineJudgeSites = resp.data.results.map((item: any) => new OnlineJudgeSite(item));
      // 读取最近登录的10个用户列表
      resp = await vm.api('member').get({action:'get_last_login_list'}, {count:10});
      vm.lastLoginMembers = resp.data;
    }
  }
</script>

<style lang="less" scoped>
  @import "../../src/libs/less-template/template-defines";

  .site-sidebar {
    /*background: #F5F5F5;*/
    float: left;
    width: 300px;
    /*padding: 20px;*/
    border-right: 1px solid #eee;
    margin-right: 20px;
    .sidebar-block {
      margin: 0 0 30px 0;
      .title {
        font-size: 15px;
        font-weight: bold;
        line-height: 32px;
        padding: 10px 10px 10px 20px;
        border-bottom: 1px solid #F5F5F5;
      }
      ul.item-list {
        padding: 10px 20px 0 30px;
        line-height: 24px;
        font-size: 14px;
      }
      .btn-create {
        color: white;
        display: block;
        border-radius: 4px;
        line-height: 44px;
        background: green;
        font-size: 15px;
        text-align: center;
        margin: 0 20px;
      }
    }
    .block-last-members {
      ul {
        .clearfix();
        margin: 10px -10px;
        li {
          float: left;
          margin: 0 8px 8px 0;
          a {
            display: block;
            img {
              display: block;
              width: 45px;
              height: 45px;
            }
          }
        }
      }
    }
  }
</style>
