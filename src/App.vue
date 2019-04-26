<template>
  <div id="app" v-if="ready">
    <site-header ref="header"/>
    <div class="site-body">
      <div class="wrapper">
        <site-sidebar></site-sidebar>
        <div class="site-content">
          <div class="block-wrapper">
            <router-view/>
          </div>
        </div>
      </div>
    </div>
    <div class="site-footer"></div>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import {Component} from 'vue-property-decorator';
  import VueBase from '@/classes/vue/VueBase';
  import SiteHeader from '@/components/SiteHeader.vue';
  import SiteSidebar from '@/components/SiteSidebar.vue';

  @Component({components: {SiteSidebar, SiteHeader}})
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

<style lang="less" scoped>
  @import './libs/less-template/template-defines';

  .site-body {
    .wrapper {
      width: 1160px;
      /*border-top: 1px solid #F5F5F5;*/
      padding: 0 20px;
      margin: 20px auto;
      position: relative;
      .clearfix();
      .site-content {
        margin-left: 320px;
        .block-wrapper {
          display: inline-block;
          width: 100%;
          .clearfix();
        }
      }
    }
  }
</style>

