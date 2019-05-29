<template>
  <div class="post-content-formatter">
    <h1>发行注记</h1>
    <br/>

    <h3>v0.2.0 (2019-5-29)</h3>
    <ul>
      <li>重磅功能发布！可以代理交题，以及显示题目的通过情况。</li>
    </ul>
    <br/>

    <h3>v0.1.7 (2019-5-28)</h3>
    <ul>
      <li>添加了用户可以查看OJ并且通过用户密码授权 ACTips 登录 OJ，为后续的题目提交做铺垫。</li>
      <li>添加了任务，用户授权OJ之后能够自动加入任务抓取所有用户的提交记录。</li>
    </ul>
    <br/>

    <h3>v0.1.6 (2019-5-27)</h3>
    <ul>
      <li>添加了OJ插件式支持，暂时发布了ZOJ版本，不过还没有集成登录和提交功能，只是开放了题目采集和浏览。</li>
      <li>添加了页脚的版权说明以及备案信息。</li>
      <li>发现Google已经收录，做了一下SEO优化让页面标题能够正确显示。</li>
    </ul>
    <br/>

    <h3>v0.1.5 (2019-5-6)</h3>
    <ul>
      <li>更改了主LOGO，解决字符画LOGO在不支持MONOSPACE字体的终端中排版崩溃的问题</li>
      <li>增加了个人资料修改以及密码修改功能，点击登录后的头像即可进入</li>
      <li>在个人中心页添加了“我的题解”，可以查看所有自己发布的题解入口</li>
    </ul>
    <br/>

    <h3>v0.1.4 (2019-4-30)</h3>
    <ul>
      <li>发布了评论功能</li>
    </ul>
    <br/>

    <h3>v0.1.3 (2019-4-29)</h3>
    <ul>
      <li>界面优化</li>
      <li>添加了题解文章引用单个题目，并且可以设置多个其他的关联题目</li>
      <li>添加了文章的原创或引用标记字段</li>
      <li>添加了文章的难度评级字段</li>
    </ul>
    <br/>

    <h3>v0.1.2 (2019-4-27)</h3>
    <ul>
      <li>导入了完整的题目分类</li>
      <li>添加了用户登录日志功能，显示最近访客</li>
      <li>可以按照OJ或者题目分类进行文章筛选</li>
    </ul>
    <br/>

    <h3>v0.1.1 (2019-4-27)</h3>
    <h4>首发版本上线</h4>
    <ul>
      <li>支持微信网页扫码登录</li>
      <li>已登录用户可发布题解</li>
      <li>可以编辑或删除自己发布的题解</li>
      <li>可以直接引用到已关联OJ的题目编号</li>
    </ul>
    <br/>

    <h3>v0.0.0 (2019-4-24)</h3>
    <p>项目立项</p>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import VueBase from '@/classes/vue/VueBase';

  @Component
  export default class About extends VueBase {
    public async mounted() {
      const vm = this;
      vm.htmlTitle = '发行注记';
    }
  }
</script>

<style lang="less" scoped>
  h1 {
    font-size: 24px;
    line-height: 48px;
  }

  a {
    text-decoration: underline;
  }

  p {
    text-indent: 2em;
    font-size: 14px;
    line-height: 24px;
    margin: 8px 0;
  }
</style>
