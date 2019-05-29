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
      <template v-if="me">
        <h4 class="block-title">提交代码</h4>
        <div class="block-submit">
          <div class="editor-frame">
            <ace-editor v-model="code" :lang="language_map[language]" theme="github" @init="editorInit"/>
          </div>
          <div class="actions">
            <i-form inline label-position="left">
              <form-item v-if="!is_site_granted">
                <p style="color: #CCC">
                  您尚未授权自己的账号登录OJ，
                  <router-link :to="{name: 'site_detail', params: {id: item.site}}">前往授权</router-link>
                  获得更好体验
                </p>
              </form-item>
              <form-item>
                使用账号
              </form-item>
              <form-item>
                <radio-group v-model="account_mode" type="button" size="small">
                  <radio :label="1" :disabled="!is_site_granted">授权账号</radio>
                  <radio :label="2">平台账号</radio>
                </radio-group>
              </form-item>
              <form-item>编程语言</form-item>
              <form-item>
                <i-select v-model="language" size="small" @input="changeLanguage">
                  <i-option v-for="lang in item.supported_languages"
                            :key="lang" :value="lang">{{lang}}
                  </i-option>
                </i-select>
              </form-item>
              <form-item>
                <poptip title="确认提交题目到OJ？"
                        placement="left-end"
                        confirm @on-ok="submit()">
                  <i-button type="primary" size="small">提交
                  </i-button>
                </poptip>
              </form-item>
            </i-form>
          </div>
        </div>
      </template>
      <h4 class="block-title">提交记录</h4>
      <i-table :columns="submissions_column" :data="submissions_data"
               size="small"></i-table>
      <div class="row-pager">
        <page :page-size="10" :total="submissions_count"
              @on-change="loadSubmissions"></page>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';

  import VueBase from '../classes/vue/VueBase';

  import PostViewItem from '@/components/PostViewItem.vue';
  import OnlineJudgeProblem from '../classes/models/OnlineJudgeProblem';
  import Member from '../classes/models/Member';

  @Component({
    components: {PostViewItem},
  })
  export default class Home extends VueBase {
    public item: OnlineJudgeProblem | null = null;

    public is_site_granted = false;

    public code = '';
    public language = '';
    public me: Member | null = null;
    public account_mode = 0;

    public language_map = {
      C: 'c_cpp',
      GCC: 'c_cpp',
      GPP: 'c_cpp',
      CPP11: 'c_cpp',
      FPC: 'pascal',
      JAVA: 'java',
      PYTHON2: 'python',
      PYTHON3: 'python',
      PERL: 'perl',
      SCHEME: 'scheme',
      PHP: 'php',
      JAVASCRIPT: 'javascript',
    };

    public submissions_column = [
      {title: 'ID', key: 'submission_id', width: 90},
      {
        title: '题目',
        align: 'center',
        width: 80,
        render(h, {row}) {
          return h('router-link', {
            props: {
              to: {name: 'problem_view', params: {id: row.problem}},
            },
          }, row.problem_num);
        },
      },
      {title: '语言', key: 'language', width: 100, align: 'center'},
      {
        title: '结果', render(h, {row}) {
          const result = row.result!.split('_').map((x: string) =>
            x[0].toUpperCase() + x.substr(1).toLowerCase(),
          ).join(' ');
          return h('span', {
            style: {
              color: result === 'Accepted' ? 'red' :
                result === 'Compilation Error' ? 'blue' : 'green',
            },
          }, result);
        },
      },
      {title: '耗时(ms)', key: 'run_time', width: 90, align: 'center'},
      {title: '内存(KB)', key: 'run_memory', width: 90, align: 'center'},
      {title: '提交时间', key: 'submit_time', width: 160},
    ];
    public submissions_data: any[] = [];
    public submissions_count = 0;


    public editorInit() {
      const vm = this;
      require('brace/ext/language_tools');
      require('brace/mode/html');
      require('brace/mode/less');
      require('brace/mode/javascript');
      require('brace/mode/c_cpp');
      require('brace/mode/scheme');
      require('brace/mode/python');
      require('brace/mode/php');
      require('brace/mode/pascal');
      require('brace/mode/java');
      require('brace/mode/perl');
      require('brace/theme/github');
      require('brace/snippets/javascript');
    }

    public changeLanguage(lang) {
      const vm = this;
      if (lang) localStorage.setItem('preferred_language_' + vm.item!.site, lang);
    }

    public async loadSubmissions(page = 1) {
      const vm = this;
      const me = await vm.getCurrentUser();
      // 获取提交记录
      const resp = await vm.api('online_judge_submission').get({}, {
        user: me!.user,
        problem: vm.item!.id,
        page,
        page_size: 10,
        ordering: '-submission_id',
      });
      vm.submissions_data = resp.data.results;
      vm.submissions_count = resp.data.count;
    }

    public async submit() {
      const vm = this;
      if (!vm.code) {
        vm.$Message.error('请填写代码再提交');
        return;
      }
      const resp = await vm.api('online_judge_problem').post({
        id: vm.item!.id,
        action: 'submit',
      }, {
        code: vm.code,
        language: vm.language,
        use_platform_account: vm.account_mode === 2,
      });
      // 清理
      vm.code = '';
      vm.$Message.success('提交成功，2秒后刷新提交列表。');
      // 稍后刷新提交列表
      setTimeout(async () => {
        await vm.loadSubmissions(1);
      }, 2000);
    }

    public async mounted() {
      const vm = this;
      const id = Number(vm.$route.params.id || 0);
      const resp = await vm.api('online_judge_problem').get({id});
      vm.item = new OnlineJudgeProblem(resp.data);
      vm.htmlTitle = `${vm.item.site_code}${vm.item.num} - ${vm.item.title}`;
      // 获取上次的语言
      vm.language = localStorage.getItem('preferred_language_' + vm.item.site) || '';
      // 验证OJ授权
      vm.me = await vm.getCurrentUser();
      vm.is_site_granted = vm.me!.granted_oj_sites.indexOf(vm.item.site) > -1;
      vm.account_mode = vm.is_site_granted ? 1 : 2;
      // 获取提交记录
      await  vm.loadSubmissions();
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
        line-height: 52px;
        text-align: center;
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
      .block-submit {
        .editor-frame {
          border-right: 1px solid #F5F5F5;
          border-bottom: 1px solid #F5F5F5;
          height: 600px;
        }
        .actions {
          margin: 8px -10px;
          text-align: right;
        }
      }
      .row-pager {
        margin: 10px 0;
        text-align: right;
      }
    }
  }
</style>

