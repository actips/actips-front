<template>
  <div>
    <div class="page-header">
      <h3 class="title">Online Judge 支持列表</h3>
    </div>
    <div class="page-body">
      <i-table :columns="columns" :data="items" size="small"></i-table>
      <div class="row-pager">
        <page :page-size="page_size" :total="data_count"
              @on-change="loadItems"></page>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import VueBase from '../classes/vue/VueBase';
  import OnlineJudgeSite from '../classes/models/OnlineJudgeSite';

  @Component
  export default class OJSiteList extends VueBase {
    public items: OnlineJudgeSite[] = [];
    public page = 1;
    public page_size = 50;
    public data_count = 0;

    public columns = [
      {title: 'ID', key: 'id', width: 50},
      {title: '简码', key: 'code', width: 120},
      {
        title: '名称',
        render(h, {row, index, column}) {
          return h('router-link', {
            props: {
              to: {name: 'site_detail', params: {id: row.id}},
            },
          }, row.name);
        },
      },
      {
        title: '支持',
        align: 'center',
        width: 60,
        render(h, {row, index, column}) {
          return h('i', {
            style: {fontSize: '16px', color: row.is_supported ? '#19be6b' : '#ed4014'},
            class: {'fa': true, 'fa-check': row.is_supported, 'fa-times': !row.is_supported},
          });
        },
      },
      {
        title: '题库',
        align: 'center',
        width: 80,
        render(h, {row, index, column}) {
          // const yes = row.supported_features.indexOf('parse_problem') > -1;
          return h('router-link', {
            props: {to: {name: 'problem_list', query: {site: row.id}}},
          }, row.problem_count);
        },
      },
      {
        title: '题解',
        align: 'center',
        width: 80,
        render(h, {row, index, column}) {
          // const yes = row.supported_features.indexOf('parse_problem') > -1;
          return h('router-link', {
            props: {to: {name: 'home', query: {problems__site__id: row.id}}},
          }, row.post_count);
        },
      },
      {
        title: '授权',
        align: 'center',
        width: 60,
        render(h, {row, index, column}) {
          return h('i', {
            style: {fontSize: '16px', color: row.is_granted ? '#19be6b' : '#ed4014'},
            class: {'fa': true, 'fa-check': row.is_granted, 'fa-times': !row.is_granted},
          });
        },
      },
    ];

    public async loadItems(page = 0) {
      const vm = this;
      // 获取数据并加入列表
      if (page) {
        vm.page = page;
      }
      const resp = await vm.api('online_judge_site').get({}, {
        page_size: vm.page_size,
        page: vm.page,
        ordering: 'pk',
      });
      vm.data_count = resp.data.count;
      vm.items.splice(0, vm.items.length, ...resp.data.results.map((item: any) => new OnlineJudgeSite(item)));
    }

    public async mounted() {
      const vm = this;
      vm.htmlTitle = 'Online Judge 支持';
      await vm.loadItems();
    }
  }
</script>

<style lang="less" scoped>
  @import '../libs/less-template/template-defines';

  .page-body {
    .row-pager {
      text-align: right;
      margin: 10px 0;
    }
  }
</style>
