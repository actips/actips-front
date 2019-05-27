<template>
  <div class="problem-item" v-if="item">
    <div class="section-title">
      <h2>{{item.site_code}}{{item.num}} - {{item.title}}</h2>
    </div>
    <div class="section-info">
      <span class="block-info block-time-limit">时间限制：{{item.time_limit}}MS</span>
      <span class="block-info block-memory-limit">内存限制：{{item.memory_limit}}KB</span>
      <span class="block-info block-special-judge"
            v-if="item.is_special_judge">SpecialJudge</span>
    </div>
    <div class="section-content">
      <h4 class="block-title">题目描述</h4>
      <div class="block-content">
        <vue-markdown>{{item.description}}</vue-markdown>
        <vue-markdown>{{item.extra_description}}</vue-markdown>
      </div>
      <template v-if="item.input_specification">
        <h4 class="block-title">输入说明</h4>
        <div class="block-content">
          <vue-markdown>{{item.input_specification}}</vue-markdown>
        </div>
      </template>
      <template v-if="item.output_specification">
        <h4 class="block-title">输出说明</h4>
        <div class="block-content">
          <vue-markdown>{{item.output_specification}}</vue-markdown>
        </div>
      </template>
      <template v-if="item.input_samples.length">
        <h4 class="block-title">样例输入</h4>
        <pre class="data" v-for="data in item.input_samples">{{data}}</pre>
      </template>
      <template v-if="item.output_samples.length">
        <h4 class="block-title">样例输出</h4>
        <pre class="data" v-for="data in item.output_samples">{{data}}</pre>
      </template>
      <div class="extra-info" v-if="Object.keys(item.extra_info).length">
        <template v-for="(val, key) in item.extra_info">
          <p><strong>{{key}}</strong>: {{val}}</p>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';

  import VueBase from '../classes/vue/VueBase';

  import PostViewItem from '@/components/PostViewItem.vue';
  import OnlineJudgeProblem from '../classes/models/OnlineJudgeProblem';

  @Component({
    components: {PostViewItem},
  })
  export default class Home extends VueBase {
    public item: OnlineJudgeProblem | null = null;

    public async mounted() {
      const vm = this;
      const id = Number(vm.$route.params['id'] || 0);
      const resp = await vm.api('online_judge_problem').get({id});
      vm.item = new OnlineJudgeProblem(resp.data);
      vm.htmlTitle = `${vm.item.site_code}${vm.item.num} - ${vm.item.title}`;
    }
  }
</script>

<style lang="less" scoped>
  .problem-item {
    font-size: 15px;
    .section-title {
      border-bottom: 1px solid #F5F5F5;
      h2 {
        font-size: 18px;
        text-align: center;
        margin: 15px;
      }
    }
    .section-info {
      padding: 15px 0;
      border-bottom: 1px solid #F5F5F5;
      text-align: center;
      .block-info {
        margin: 0 15px;
      }
    }
    .section-content {
      padding: 15px 0;
      .block-title {
        font-size: 16px;
        line-height: 32px;
        padding-left: 15px;
        border-left: 4px solid fade(#2d8cf0, 40%);
        background: fade(#2d8cf0, 10%);
      }
      .block-content {
        padding: 15px;
        border: 1px solid #F5F5F5;
        border-top: 0;
        margin-bottom: 15px;
      }
      /deep/ p:not(:last-child) {
        text-align: justify;
        line-height: 1.5em;
        margin: 0 0 1.5em 0;
      }
      /deep/ em {
        font-style: italic;
      }
      /deep/ u {
        text-decoration: underline;
      }
      /deep/ b, /deep/ strong {
        font-weight: bold;
      }
      pre.data {
        padding: 15px;
        background: #F5F5F5;
        margin-bottom: 15px
      }
      .extra-info {
        margin-top: 15px;
        padding: 15px 0;
        p {
          line-height: 1.5px;
        }
      }
    }
  }
</style>

