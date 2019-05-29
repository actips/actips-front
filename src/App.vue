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
    <site-footer></site-footer>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import {Component} from 'vue-property-decorator';
  import VueBase from '@/classes/vue/VueBase';
  import SiteHeader from '@/components/SiteHeader.vue';
  import SiteFooter from '@/components/SiteFooter.vue';
  import SiteSidebar from '@/components/SiteSidebar.vue';

  @Component({components: {SiteSidebar, SiteHeader, SiteFooter}})
  export default class App extends VueBase {
    public ready = false;

    public async mounted() {
      const vm = this;
      const func = async () => {
        // TODO: DEBUG 不知为何这里第一次加载的时候变成获取不到 $route 内容了
        // 写一个 Ugly waitFor 先解决问题
        if (!vm.$route.name) {
          // console.log('miss!');
          setTimeout(func, 50);
          return;
        }
        // 如果有登录凭据参数，执行登录
        const ticket = (vm.$route.query.ticket || '').toString();
        if (ticket) {
          await vm.loginWithTicket(ticket);
          // 从 url 上面删除 ticket 参数
          const newQuery = vm.$route.query;
          delete newQuery.ticket;
          vm.$router.replace({query: newQuery});
        }
        // 总是尝试获取当前用户
        await vm.getCurrentUser().catch(() => 0);
        // console.log(1, JSON.parse(JSON.stringify(vm.ctx)));
        // 内部需要通知刷新
        // (vm.$refs.header as Vue).$forceUpdate();
        vm.ready = true;
      };
      await func();
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

