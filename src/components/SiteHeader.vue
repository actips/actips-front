<template>
  <div class="site-header">
    <div class="wrapper">
      <div class="status">
        <div v-if="ctx.me" class="block-user">
          <img class="avatar" :src="ctx.me.avatar_url"/>
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
      <div class="nav">
        <ul class="menu">
          <li>
            <router-link :to="{name:'home'}">首页</router-link>
          </li>
          <li>
            <a href="javascript:alert('功能计划：做不出来的题目找帮手？在这里发布吧！')">求助</a>
          </li>
          <li>
            <router-link :to="{name:'about'}">关于</router-link>
          </li>
        </ul>
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
    background: #F5F5F5;
    padding-bottom: 15px;
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
    .nav {
      font-weight: bold;
      text-align: left;
      font-size: 14px;
      padding-left: 20px;
      padding-top: 40px;
      float: left;
      line-height: 20px;
      ul.menu {
        li {
          display: inline-block;
          margin: 0 20px;
          .router-link-active {
            color: blue;
          }
        }
      }
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
