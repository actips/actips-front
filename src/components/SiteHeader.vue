<template>
  <div class="site-header">
    <div class="wrapper">
      <div class="logo">
        <pre>
 ______     ______     ______   __     ______   ______
/\  __ \   /\  ___\   /\__  _\ /\ \   /\  == \ /\  ___\
\ \  __ \  \ \ \____  \/_/\ \/ \ \ \  \ \  _-/ \ \___  \
 \ \_\ \_\  \ \_____\    \ \_\  \ \_\  \ \_\    \/\_____\
  \/_/\/_/   \/_____/     \/_/   \/_/   \/_/     \/_____/
        </pre>
      </div>
      <div v-if="ctx.me">
        <img class="avatar" :src="ctx.me.avatarUrl"/>
        {{ctx.me.nickname}}
      </div>
      <div v-else><a @click="loginWechat" href="javascript:">登录</a></div>
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
  }
</script>

<style lang="less" scoped>
  @import "../../src/libs/less-template/template-defines";

  .site-header {
    .wrapper {
      width: 1280px;
      margin: 0 auto;
    }
    .logo {
      font-family: monospace;
      font-size: 12px;
      font-weight: bolder;
      -webkit-transform: scale(0.8);
      -moz-transform: scale(0.8);
      -ms-transform: scale(0.8);
      -o-transform: scale(0.8);
      transform: scale(0.8);
    }
  }
</style>
