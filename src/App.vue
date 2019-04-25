<template>
  <div id="app" v-if="ready">
    <site-header ref="header"/>
    <router-view/>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import {Component} from 'vue-property-decorator';
  import SiteHeader from '@/components/SiteHeader.vue';
  import VueBase from './classes/vue/VueBase';

  @Component({components: {SiteHeader}})
  export default class App extends VueBase {
    public ready = false;

    private async mounted() {
      const vm = this;
      // 如果有登录凭据参数，执行登录
      const key = 'ticket';
      const ticket = (vm.$route.query[key] || '').toString();
      if (ticket) {
        await vm.loginWithTicket(ticket);
        // 从 url 上面删除 ticket 参数
        const newQuery = vm.$route.query;
        delete newQuery[key];
        vm.$router.replace({query: newQuery});
      }
      // 总是尝试获取当前用户
      await vm.getCurrentUser().catch(() => 0);
      // console.log(1, JSON.parse(JSON.stringify(vm.ctx)));
      // 内部需要通知刷新
      // (vm.$refs.header as Vue).$forceUpdate();
      vm.ready = true;
    }
  }
</script>
