<template>
  <div class="page-personal">
    <div class="page-header">
      <ul class="personal-menu">
        <li class="menu-item">
          <router-link :to="{name:'personal_profile', replace:true}">个人资料</router-link>
        </li>
        <li class="menu-item">
          <router-link :to="{name:'personal_posts', replace:true}">我的题解</router-link>
        </li>
      </ul>
    </div>
    <div class="page-body">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
  import { Component, Vue } from 'vue-property-decorator';
  import VueBase from '../classes/vue/VueBase';

  @Component
  export default class Personal extends VueBase {
  }
</script>

<style lang="less" scoped>
  .page-header {
    padding: 10px 0;
    height: 52px;
    line-height: 32px;
    font-size: 14px;
    border-bottom: 1px solid #F5F5F5;

    .filtering {
      display: inline-block;
    }

    .actions {
      float: right;
    }
    ul.personal-menu {
      text-align: center;
      li.menu-item {
        display: inline-block;
        margin: 0 25px;
        a.router-link-active {
          font-weight: bold;
          color: #2d8cf0;
        }
      }
    }
  }

  .page-body {
  }
</style>
