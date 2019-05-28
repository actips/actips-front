<template>
  <div class="site-header">
    <div class="wrapper">
      <div class="status">
        <div v-if="ctx.me" class="block-user">
          <router-link :to="{name:'personal_profile'}">
            <img class="avatar" :src="ctx.me.avatar_url"/>
          </router-link>
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
        <img src="../assets/images/ACTips-40.png"/>
        <pre>v0.1.6</pre>
      </div>
      <div class="nav">
        <ul class="menu">
          <li>
            <router-link :to="{name:'home'}">首页</router-link>
          </li>
          <li>
            <router-link :to="{name:'sites'}">OJ</router-link>
          </li>
          <li>
            <router-link :to="{name:'problem_list'}">题库</router-link>
          </li>
          <li>
            <router-link :to="{name:'question'}">问答</router-link>
          </li>
          <li>
            <router-link :to="{name:'submit'}">交题</router-link>
          </li>
          <li>
            <router-link :to="{name:'challenge'}">挑战</router-link>
          </li>
          <li>
            <router-link :to="{name:'about'}">关于</router-link>
          </li>
          <li>
            <router-link :to="{name:'version'}">版本</router-link>
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
    /*padding-bottom: 15px;*/
    .wrapper {
      width: 1160px;
      padding: 0 10px;
      margin: 0 auto;
      height: 60px;
      overflow: hidden;
      text-align: center;
    }
    .logo {
      float: left;
      text-align: left;
      font-weight: bolder;
      display: inline-block;
      img {
        float: left;
      }
      pre {
        float: left;
        /*font-family: monospace;*/
        margin-left: 5px;
        font-size: 14px;
        margin-top: 24px;
      }
    }
    .nav {
      font-weight: bold;
      text-align: left;
      font-size: 14px;
      padding-left: 20px;
      padding-top: 20px;
      float: left;
      line-height: 20px;
      ul.menu {
        li {
          display: inline-block;
          margin: 0 20px;
          .router-link-active {
            color: #2d8cf0;
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
          width: 40px;
          height: 40px;
          margin: 10px;
          float: left;
        }
        .name {
          margin: 10px 0 10px 60px;
        }
      }
      .block-nologin {
        margin: 20px 0;
      }
    }
  }
</style>
