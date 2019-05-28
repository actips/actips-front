<template>
  <div v-if="item">
    <header class="page-header">
      <h2 class="title">查看文章</h2>
      <div class="actions">
        <i-button type="default" @click="$router.back()">返回</i-button>
        <i-button type="primary" @click="submit()">提交</i-button>
      </div>
    </header>
    <div class="page-content">
      <post-view-item v-if="item" :item="item" :is-detail="true"/>
    </div>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';

  import VueBase from '../classes/vue/VueBase';
  import ProblemPost from '@/classes/models/ProblemPost';

  import PostViewItem from '@/components/PostViewItem.vue';


  @Component({
    components: {PostViewItem},
  })
  export default class Home extends VueBase {
    public item: ProblemPost | null = null;

    public async mounted() {
      const vm = this;
      const id = Number(vm.$route.params.id || 0);
      const resp = await vm.api('problem_post').get({id});
      vm.item = new ProblemPost(resp.data);
      vm.htmlTitle = vm.item.title;
    }
  }
</script>

<style lang="less" scoped>
  header.page-header {
    line-height: 48px;
    border-bottom: 1px solid #F5F5F5;
    margin-bottom: 20px;
    h2.title {
      font-size: 15px;
      font-weight: bold;
      display: inline-block;
    }
    .actions {
      float: right;
      button {
        margin-left: 4px;
      }
    }
  }

  .modal-problems {
    .problem-title {
      margin-bottom: 15px;
      font-size: 14px;
      font-weight: bold;
      color: #2d8cf0;
      .actions {
        float: right;
      }
    }
  }
</style>

