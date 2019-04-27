<template>
  <div>
    <div class="page-header">
      <i-form class="filtering" inline @keydown.native.enter.prevent>
        <form-item>
          <i-select v-model="filterSiteId">
            <i-option v-for="opt in filterSiteChoices"
                      :value="opt.value" :key="opt.value">{{opt.text}}
            </i-option>
          </i-select>
        </form-item>
        <form-item>
          <i-select v-model="filterCategoryId">
            <i-option v-for="opt in filterCategoryChoices"
                      :value="opt.value" :key="opt.value">{{opt.text}}
            </i-option>
          </i-select>
        </form-item>
        <form-item>
          <i-input v-model="filterKeyword" @enter="doQuery"></i-input>
        </form-item>
        <form-item>
          <i-button type="primary" icon="ios-search" @click="doQuery">搜索</i-button>
        </form-item>
      </i-form>
      <div class="actions">
        <i-button @click="$router.push({name:'post_edit', params:{id:0}})"
                  type="primary">发布题解
        </i-button>
      </div>
    </div>
    <div class="page-body">
      <ul class="post-list">
        <li v-for="item in items" class="post-item">
          <post-view-item :item="item" :is-detail="false"
                          @delete="onPostDelete"/>
        </li>
      </ul>
      <div v-if="hasMore" class="block-more">
        <i-button size="large" @click="loadItems">加载更多</i-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import {Component, Vue, Watch} from 'vue-property-decorator';
  import ProblemPost from '../classes/models/ProblemPost';
  import VueBase from '../classes/vue/VueBase';
  import Member from '../classes/models/Member';
  import PostViewItem from '../components/PostViewItem.vue';

  @Component({
    components: {PostViewItem},
  })
  export default class Home extends VueBase {
    public items: ProblemPost[] = [];
    public page = 1;
    public hasMore = false;
    public me: Member | null = null;

    // OJ 选择
    public filterSiteChoices: Array<{ text: string, value: number }> = [{text: '全部', value: 0}];
    public filterSiteId = 0;

    // 分类选择
    public filterCategoryChoices: Array<{ text: string, value: number }> = [{text: '全部', value: 0}];
    public filterCategoryId = 0;

    // 关键词
    public filterKeyword = '';

    public async loadListOJSites() {
      const vm = this;
      const resp = await vm.api('online_judge_site').get({}, {page_size: 0});
      vm.filterSiteChoices.splice(1, 0,
        ... resp.data.results.map((item: any) => ({text: item.name, value: item.id})));
    }

    public async loadListCategories() {
      const vm = this;
      const resp = await vm.api('problem_category').get({}, {page_size: 0});
      vm.filterCategoryChoices.splice(1, 0,
        ... resp.data.results.map((item: any) => ({text: item.name, value: item.id})));
    }

    public async doQuery() {
      const vm = this;
      vm.$router.replace({query: vm.query});
    }

    public get query(): any {
      const vm = this;
      const query: any = {};
      if (vm.filterKeyword) {
        query['search'] = vm.filterKeyword;
      }
      if (vm.filterCategoryId) {
        query['categories__id'] = vm.filterCategoryId;
      }
      if (vm.filterSiteId) {
        query['problems__site__id'] = vm.filterSiteId;
      }
      return query;
    }

    public async loadItems(reset = false) {
      const vm = this;
      // 如果重置
      if (reset) {
        vm.items = [];
        vm.page = 1;
      }
      // 获取数据并加入列表
      const resp = await vm.api('problem_post').get({}, {page_size: 10, page: vm.page, ...vm.query});
      vm.items.splice(vm.items.length, 0, ...resp.data.results.map((item: any) => new ProblemPost(item)));
      vm.page += 1;
      vm.hasMore = resp.data.count > 0 && Math.floor((resp.data.count - 1) / 10) + 1 < resp.data.pages;
    }

    public async onPostDelete(item: ProblemPost) {
      const vm = this;
      vm.items.splice(vm.items.indexOf(item), 1);
    }

    private async mounted() {
      const vm = this;
      await vm.loadListOJSites();
      await vm.loadListCategories();
      vm.filterSiteId = Number(vm.$route.query.problems__site__id || 0);
      vm.filterCategoryId = Number(vm.$route.query.categories__id || 0);
      vm.filterKeyword = (vm.$route.query.search || '') as string;
      vm.me = await vm.getCurrentUser();
      await vm.loadItems();
    }

    @Watch('$route')
    private async beforeRouteUpdate(to: any, from: any) {
      const vm = this;
      vm.filterSiteId = Number(vm.$route.query.problems__site__id || 0);
      vm.filterCategoryId = Number(vm.$route.query.categories__id || 0);
      vm.filterKeyword = (vm.$route.query.search || '') as string;
      await vm.loadItems(true);
    }
  }
</script>

<style lang="less" scoped>
  @import '../libs/less-template/template-defines';

  .page-header {
    padding: 10px;
    height: 52px;
    border-bottom: 1px solid #F5F5F5;
    /*overflow: hidden;*/
    .filtering {
      display: inline-block;
    }
    .actions {
      float: right;
    }
  }

  .page-body {
    ul.post-list {
      font-size: 14px;
      li.post-item {
        .clearfix();
        padding: 20px 10px;
        border-bottom: 1px solid #F5F5F5;
        .post-header {
          .clearfix();
          line-height: 36px;
          margin-bottom: 15px;
          .post-title {
            font-size: 18px;
            float: left;
            button {
              margin-right: 4px;
            }
          }
          .post-actions {
            float: right;
            button {
              margin-right: 4px;
            }
          }
        }
        .post-content {
          overflow: hidden;
          position: relative;
          max-height: 380px;
          .transition-duration(0.5s);
          &.collapsable {
            .show-more {
              display: block;
            }
            &.expand .show-less {
              display: block;
            }
          }
          &.expand {
            max-height: 9999px;
            .show-more {
              display: none;
            }
          }
          .show-less {
            display: none;
            .btn-collapse {
              position: absolute;
              display: block;
              background: white;
              padding: 10px 4px;
              border: 1px solid #2d8cf0;
              border-radius: 5px 0 0 5px;
              color: #2d8cf0;
              right: 0;
              top: 20px;
              line-height: 1em;
              height: 2em;
              box-sizing: content-box;
              opacity: 0.7;
              .transition-duration(0.5s);
              &:hover {
                opacity: 1;
              }
            }
          }
          .show-more {
            display: none;
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            &::before {
              content: "";
              position: absolute;
              height: 100px;
              bottom: 0;
              left: 0;
              right: 0;
              display: block;
              background: svg-gradient(to bottom, fade(white, 0), white);
            }
            .btn-expand {
              display: block;
              margin: 10px auto;
              width: 5em;
              color: #2d8cf0;
              border: 1px solid #2d8cf0;
              text-align: center;
              border-radius: 4px;
              background: white;
              position: relative;
              opacity: 0.7;
              .transition-duration(0.5s);
              &:hover {
                opacity: 1;
              }
            }
          }
          .content {
          }
        }
        .post-footer {
          margin-top: 20px;
          .clearfix();
          .post-categories {
            float: left;
            margin-bottom: 6px;
          }
          .post-status {
            float: right;
            text-align: left;
            /*width: 180px;*/
            .post-author {
              line-height: 24px;
              img.avatar {
                width: 24px;
                height: 24px;
                display: inline-block;
                vertical-align: middle;
                margin-right: 10px;
              }
            }
            .post-date {
              font-size: 12px;
              line-height: 24px;
              color: #888888;
            }
          }
        }
      }
    }
    .block-more {
      text-align: center;
      padding: 30px 0;
    }
  }
</style>
