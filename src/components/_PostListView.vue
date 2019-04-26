<template>
  <ul></ul>
</template>

<script lang="ts">
  import {Component} from 'vue-property-decorator';
  import VueBase from '../classes/vue/VueBase';
  import ProblemCategory from '../classes/models/ProblemCategory';
  import OnlineJudgeSite from '../classes/models/OnlineJudgeSite';

  @Component
  export default class SiteSidebar extends VueBase {
    public categories: ProblemCategory[] = [];
    public onlineJudgeSites: OnlineJudgeSite[] = [];

    private async mounted() {
      const vm = this;
      let resp: any;
      // 读取分类列表
      resp = await vm.api('problem_category').get({page_size: 0});
      vm.categories = resp.data.results.map((item: any) => new ProblemCategory(item));
      // 读取OJ列表
      resp = await vm.api('online_judge_site').get({page_size: 0});
      vm.onlineJudgeSites = resp.data.results.map((item: any) => new OnlineJudgeSite(item));
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
      margin: 10px 0 30px 0;
      .title {
        padding-left: 20px;
        font-size: 15px;
        font-weight: bold;
        line-height: 44px;
        border-bottom: 1px solid #F5F5F5;
        margin-right: 10px;
        margin-bottom: 10px;
      }
      ul.item-list {
        padding: 0 20px 0 30px;
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
  }
</style>
