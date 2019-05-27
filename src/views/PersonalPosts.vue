<template>
  <div class="sub-page-personal-posts">
    <ul class="post-list">
      <li class="post-item" v-for="item in items">
        <i-button v-if="item.problem" :key="item.problem"
                  size="small" @click="viewProblem(item.problem_url, item.problem)">
          {{item.problem_site_code}}{{item.problem_num}}
        </i-button>
        <router-link class="title" :to="{name:'post_view',params:{id:item.id}}">{{item.title}}</router-link>
        <router-link class="link-edit" :to="{name:'post_edit',params:{id:item.id}}">修改</router-link>
        <poptip word-wrap width="120" title="确认删除？" confirm @on-ok="deletePost(item)">
          <a class="link-delete" href="javascript:">删除</a>
        </poptip>
        <span class="date">{{item.date_created}}</span>
      </li>
    </ul>
    <div v-if="hasMore" class="block-more">
      <i-button size="large" @click="loadItems(false)">加载更多</i-button>
    </div>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import VueBase from '../classes/vue/VueBase';
  import ProblemPost from '../classes/models/ProblemPost';

  @Component
  export default class PersonalPosts extends VueBase {
    public items: ProblemPost[] = [];
    public page = 1;
    public hasMore = false;

    public async loadItems(reset = false) {
      const vm = this;
      if (!vm.ctx || !vm.ctx.me) {
        return;
      }
      vm.hasMore = false;
      // 如果重置
      if (reset) {
        vm.items = [];
        vm.page = 1;
      }
      // 获取数据并加入列表
      const page_size = 10;
      const resp = await vm.api('problem_post').get({}, {page_size, page: vm.page, author: vm.ctx.me.user});
      vm.items.splice(vm.items.length, 0, ...resp.data.results.map((item: any) => new ProblemPost(item)));
      vm.hasMore = vm.page < resp.data.pages;
      vm.page += 1;
    }

    public async deletePost(item: ProblemPost) {
      const vm = this;
      await vm.api('problem_post').delete({id: item.id});
      vm.loadItems(true);
    }

    public async mounted() {
      const vm = this;
      vm.htmlTitle = '我的题解';
      await vm.loadItems();
    }
  }
</script>

<style lang="less" scoped>
  @import '../libs/less-template/template-defines';

  ul.post-list {
    /*padding: 15px 0;*/
    li.post-item {
      padding: 15px 10px;
      line-height: 24px;
      border-bottom: 1px dashed #F5F5F5;
      &:hover {
        background: fade(yellow, 10%);
        .link-edit, .link-delete {
          opacity: 1;
        }
      }
      .title {
        margin: 0 10px;
        font-size: 16px;
      }
      .link-edit {
        opacity: 0;
        .transition-duration(0.5s);
        color: #2d8cf0;
      }
      .link-delete {
        margin-left: 10px;
        opacity: 0;
        .transition-duration(0.5s);
        color: red;
      }
      .date {
        float: right;
      }
    }
  }
</style>
