<template>
  <div class="site-footer">
    <div class="wrapper">
      <p>ACTips.org &copy; 2019 | 为ACMer's量身订造的成长社区 |
        <a href="http://www.miitbeian.gov.cn" nofollow target="_blank">粤ICP备14050779号-2</a> |
        作者: <a href="https://github.com/fish-ball" target="_blank">呆滞的慢板</a> |
        技术支持: <a href="http://www.easecloud.cn" target="_blank">逸云科技</a> |
        <a class="fa fa-github" href="https://github.com/actips" target="_blank"> ACTips</a>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
  import {Component} from 'vue-property-decorator';
  import VueBase from '../classes/vue/VueBase';

  @Component
  export default class SiteFooter extends VueBase {
  }
</script>

<style lang="less" scoped>
  @import "../../src/libs/less-template/template-defines";

  .site-footer {
    background: #F5F5F5;
    font-family: monospace;
    /*padding-bottom: 15px;*/
    .wrapper {
      width: 1160px;
      padding: 25px 10px;
      margin: 0 auto;
      overflow: hidden;
      text-align: right;
      color: #AAA;
      a {
        color: inherit;
      }
    }
  }
</style>
