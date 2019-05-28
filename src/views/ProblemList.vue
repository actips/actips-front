<template>
  <div>
    <div class="page-header">
      <h3 class="title">题库</h3>
    </div>
    <div class="page-body">
      <i-table :columns="columns" :data="items" size="small"></i-table>
      <div class="row-pager">
        <page :page-size="page_size" :total="data_count" @on-change="loadItems"></page>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import VueBase from '../classes/vue/VueBase';
  import OnlineJudgeProblem from '../classes/models/OnlineJudgeProblem';

  @Component
  export default class OJSiteList extends VueBase {
    public items: OnlineJudgeProblem[] = [];
    public page = 1;
    public page_size = 20;
    public data_count = 0;

    public columns = [
      {title: 'ID', key: 'id', width: 80},
      {title: 'OJ', key: 'site_code', width: 120},
      {title: '编号', key: 'num', width: 120},
      {
        title: '标题',
        render(h, {row, index, column}) {
          return h('router-link', {
            props: {
              to: {name: 'problem_view', params: {id: row.id}},
            },
          }, row.title);
        },
      },
      {
        title: '可用',
        align: 'center',
        width: 60,
        render(h, {row, index, column}) {
          return h('i', {class: {'fa': true, 'fa-check': row.is_synced}});
        },
      },
      // {
      //   title: '操作',
      //   align: 'center',
      //   width: 60,
      //   render(h, {row, index, column}) {
      //     return h('i-button', {
      //       props: {
      //         size: 'small',
      //       },
      //       on: {
      //         click() {
      //           (window as any).app.$router.push({name: 'problem_view', params: {id: row.id}});
      //         },
      //       },
      //     }, '查看');
      //   },
      // },
    ];

    public async loadItems(page = 0) {
      const vm = this;
      // 获取数据并加入列表
      if (page) {
        vm.page = page;
      }
      const query: any = {};
      if (vm.$route.query.site) {
        query.site = vm.$route.query.site;
      }
      const resp = await vm.api('online_judge_problem').get({}, {
        page_size: vm.page_size,
        page: vm.page,
        ordering: 'site,num',
        is_synced: 'True',
        ...query,
      });
      vm.data_count = resp.data.count;
      vm.items.splice(0, vm.items.length, ...resp.data.results.map((item: any) => new OnlineJudgeProblem(item)));
    }

    public async mounted() {
      const vm = this;
      vm.htmlTitle = '题库';
      await vm.loadItems();
    }
  }
</script>

<style lang="less" scoped>
  @import '../libs/less-template/template-defines';

  .page-header {
    h3.title {
      font-size: 18px;
      line-height: 36px;
      /*border-bottom: 1px solid #F5F5F5;*/
      margin-bottom: 10px;
    }
  }

  .page-body {
    .row-pager {
      text-align: right;
      margin: 10px 0;
    }
  }
</style>
