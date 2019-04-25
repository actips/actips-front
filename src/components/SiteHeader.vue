<template>
  <div class="site-header">
    <div class="wrapper">
      <div class="status">
        <div v-if="ctx.me" class="block-user">
          <img class="avatar" :src="ctx.me.avatarUrl"/>
          <div class="name">
            <div>{{ctx.me.nickname}}</div>
            <div><a @click="doLogout()" href="javascript:">注销</a></div>
          </div>
        </div>
        <div v-else class="block-nologin">
          <a @click="loginWechat()" href="javascript:">登录</a>
        </div>
      </div>
      <div class="logo">
        <pre>
 ______     ______     ______   __     ______   ______
/\  __ \   /\  ___\   /\__  _\ /\ \   /\  == \ /\  ___\
\ \  __ \  \ \ \____  \/_/\ \/ \ \ \  \ \  _-/ \ \___  \
 \ \_\ \_\  \ \_____\    \ \_\  \ \_\  \ \_\    \/\_____\
  \/_/\/_/   \/_____/     \/_/   \/_/   \/_/     \/_____/
        </pre>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import {Component} from 'vue-property-decorator';
  import VueBase from '../classes/vue/VueBase';

  @Component
  export default class SiteHeader extends VueBase {

    public loginWechat() {
      const vm = this;
      const form = document.createElement('form');
      form.method = 'post';
      form.action = vm.ctx.config.wxApiRoot + '/auth/' + vm.ctx.config.wxAppId + '/';
      const input = document.createElement('input');
      input.type = 'hidden';
      input.name = 'redirect_uri';
      input.value = location.href;
      form.appendChild(input);
      document.body.appendChild(form);
      form.submit();
    }

    public async doLogout() {
      const vm = this;
      await vm.logout();
      vm.$forceUpdate();
    }

  }
</script>

<style lang="less" scoped>
  @import "../../src/libs/less-template/template-defines";

  .site-header {
    background: white;
    .wrapper {
      width: 1160px;
      padding: 0 20px;
      margin: 0 auto;
      height: 80px;
      overflow: hidden;
      text-align: center;
    }
    .logo {
      float: left;
      text-align: left;
      font-family: monospace;
      font-size: 12px;
      font-weight: bolder;
      line-height: 12px;
      margin: 10px 0;
      display: inline-block;
    }
    .status {
      float: right;
      line-height: 20px;
      font-size: 14px;
      text-align: right;
      .block-user {
        .clearfix();
        .avatar {
          .circle();
          width: 50px;
          height: 50px;
          margin: 15px;
          float: left;
        }
        .name {
          margin: 20px 0 20px 80px;
        }
      }
      .block-nologin {
        margin: 30px 0;
      }
    }
  }
</style>
