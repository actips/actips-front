<template>
  <div>
    <div class="page-header">
      <i-form inline class="filtering">
        <form-item>
          <i-select></i-select>
        </form-item>
        <form-item>
          <i-select></i-select>
        </form-item>
        <form-item>
          <i-input></i-input>
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
          <div class="post-title">{{item.title}}</div>
          <div class="post-excerpt">
            <pre>{{item.excerpt}}</pre>
          </div>
        </li>
      </ul>
      <div v-if="hasMore" class="block-more">
        <i-button size="large" @click="loadItems">加载更多</i-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import ProblemPost from '../classes/models/ProblemPost';
  import VueBase from '../classes/vue/VueBase';

  @Component
  export default class Home extends VueBase {
    public items: ProblemPost[] = [];
    public page = 1;
    public hasMore = true;

    public async loadItems() {
      const vm = this;
      const resp = await vm.api('problem_post').get({page_size: 10, page: vm.page});
      vm.items.splice(vm.items.length, 0, ...resp.data.results);
      vm.page += 1;
      if (Math.floor((resp.data.count - 1) / 10) + 1 === resp.data.pages) {
        vm.hasMore = false;
      }
    }

    private async mounted() {
      const vm = this;
      await vm.loadItems();
    }
  }
</script>

<style lang="less" scoped>
  @import '../libs/less-template/template-defines';

  .page-header {
    padding: 10px;
    height: 52px;
    border-bottom: 1px solid #F5F5F5;
    overflow: hidden;
    .filtering {
      display: inline-block;
    }
    .actions {
      float: right;
    }
  }

  .page-body {
    ul.post-list {
      li.post-item {
        .clearfix();
        padding: 20px;
        border-bottom: 1px solid #F5F5F5;
        .post-title {
          font-size: 15px;
        }
        .post-excerpt {
          font-size: 14px;
        }
        .post-footer {
        }
      }
    }
    .block-more {
      text-align: center;
      padding: 30px 0;
    }
  }
</style>
