<template>
  <div v-if="item">
    <div class="page-header">
      <h3 class="title">{{item.code}} - {{item.name}}</h3>
    </div>
    <div class="page-body">
      <section class="section section-site-info">
        <h4 class="section-title">Online Judge 信息</h4>
        <i-form :label-width="80" label-position="left">
          <form-item label="首页">
            <a :href="item.homepage" target="_blank">{{item.homepage}}</a>
          </form-item>
          <form-item label="接入功能">
            <i-table :columns="feature_column" :data="feature_data"
                     size="small"></i-table>
          </form-item>
        </i-form>
      </section>
      <section class="section section-user-profile"
               v-if="item.supported_features.indexOf('get_user_context_by_user_and_password') > -1">
        <h4 class="section-title">用户凭据</h4>
        <i-form :label-width="80" label-position="left">
          <form-item label="密码授权">
            <template v-if="profile">
              <poptip confirm title="确认取消你对这个OJ平台的授权？"
                      @on-ok="cancelGrant()">
                <i-button size="small" ghost type="error">取消授权</i-button>
              </poptip>
            </template>
            <template v-else>
              <i-button size="small" @click="showGrantPassword()">授权密码登录</i-button>
            </template>
          </form-item>
          <!-- TODO: 绕过提供用户名和密码的会话授权，采用跨域提交 cookie 的方式 -->
          <!--<form-item label="会话授权">-->
          <!--<i-button size="small" @click="showGrantSession()">授权SESSION登录</i-button>-->
          <!--</form-item>-->
        </i-form>
      </section>
      <section class="section section-user-profile" v-if="submissions_count">
        <h4 class="section-title">提交记录</h4>
        <i-table :columns="submissions_column" :data="submissions_data"
                 size="small"></i-table>
        <div class="row-pager">
          <page :page-size="10" :total="submissions_count"
                @on-change="loadSubmissions"></page>
        </div>
      </section>
    </div>


    <!--TODO: 暂时图快，后期的话一旦出现需要复用就重构成模块-->
    <modal
        v-model="showModalGrantPassword"
        class="modal-password"
        title="密码授权"
        :closable="false"
        :loading="loadingGrantPassword"
        @on-ok="submitGrantPassword()"
        :footer-hide="false">
      <i-form @keydown.native.enter.prevent label-position="left"
              :label-width="60" :model="formGrantPassword">
        <form-item label="登录名">
          <i-input size="small" style="width: 200px" v-model="formGrantPassword.username"></i-input>
        </form-item>
        <form-item label="密码">
          <i-input size="small" style="width: 200px" type="password" v-model="formGrantPassword.password"></i-input>
        </form-item>
        <form-item label="授权">
          <checkbox v-model="formGrantPassword.grant_store">允许ACTips保存我的密码</checkbox>
        </form-item>
      </i-form>
      <alert type="warning">
        授权声明
        <p slot="desc">
          1. ACTips将在后台使用您的账号密码登录OJ并且维持登录。<br/>
          2. 您在这个OJ网站上的活动记录会被抓取到本站进行存储分析。<br/>
          3. 授权Session可能会在一段时间后失效，届时提交题目时可能会要求重新授权。<br/>
          4. 授权“保存我的密码”可以使Session失效后自动回复登录，连接更为稳定。<br/>
          5. 如未授权<strong>“允许ACTips保存我的密码”</strong>，ACTips将不会保存您的账号密码信息。<br/>
          6. <strong style="color: red">绝对不要使用与关键系统（支付密码等）相同的密码，避免撞库风险。</strong>
        </p>
      </alert>
    </modal>

  </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import VueBase from '../classes/vue/VueBase';
  import OnlineJudgeSite from '../classes/models/OnlineJudgeSite';
  import _ from 'lodash';

  @Component
  export default class OJSiteDetail extends VueBase {
    public item: OnlineJudgeSite | null = null;

    public profile: any = null;

    public feature_map = {
      get_all_contest_numbers: '获取所有的比赛编号',
      get_all_problem_numbers: '获取所有的题目编号',
      get_problem_url: '通过题号获取题目链接',
      parse_problem: '解析题目内容',
      get_user_context_by_user_and_password: '通过用户名密码获取会话',
      check_context_validity: '检查会话有效性',
      get_user_solved_problem_list: '获取用户已解决的题目列表',
      get_user_failed_problem_list: '获取用户失败尝试的题目列表',
      get_user_submission_list: '获取用户的提交列表',
      submit_problem: '提交问题到OJ',
    };

    public feature_column = [
      {title: 'KEY', key: 'key', width: 300},
      {title: '功能名称', key: 'name'},
      {
        title: '支持',
        width: 60,
        align: 'center',
        render(h, {row}) {
          return h('i', {
            style: {
              color: row.supported ? '#19be6b' : '#ed4014',
              fontSize: '16px',
            },
            class: {
              'fa': true,
              'fa-check': row.supported,
              'fa-times': !row.supported,
            },
          });
        },
      },
    ];
    public feature_data: any[] = [];

    public submissions_column = [
      {title: 'ID', key: 'submission_id', width: 100},
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
      {title: '语言', key: 'language', width: 80, align: 'center'},
      {title: '结果', key: 'result'},
      {title: '耗时(ms)', key: 'run_time', width: 100, align: 'center'},
      {title: '内存(KB)', key: 'run_memory', width: 100, align: 'center'},
      {title: '提交时间', key: 'submit_time', width: 160},
    ];
    public submissions_data: any[] = [];
    public submissions_count = 0;

    public showModalGrantPassword = false;
    public loadingGrantPassword = true;
    public formGrantPassword = {
      username: '',
      password: '',
      grant_store: true,
    };

    public showModalGrantSession = false;

    public showGrantPassword() {
      const vm = this;
      vm.showModalGrantPassword = true;
      vm.formGrantPassword.username = '';
      vm.formGrantPassword.password = '';
      vm.formGrantPassword.grant_store = false;
    }

    public async submitGrantPassword() {
      const vm = this;
      const resp = await vm.api('online_judge_site').post({
        id: vm.item!.id,
        action: 'grant_password',
      }, vm.formGrantPassword).catch(() => {
        // 失败的话直接返回状态
        // 取消loading状态
        vm.loadingGrantPassword = false;
        vm.$nextTick(() => {
          vm.loadingGrantPassword = true;
        });
        return 0;
      });
      if (!resp) return;
      // 正常情况下
      vm.showModalGrantPassword = false;
    }

    public async cancelGrant() {
      const vm = this;
      await vm.api('online_judge_site').post({
        id: vm.item!.id,
        action: 'cancel_grant',
      }, {});
      vm.profile = null;
    }

    public showGrantSession() {
      const vm = this;
      vm.showModalGrantSession = true;
    }

    public async loadSubmissions(page = 1) {
      const vm = this;
      const me = await vm.getCurrentUser();
      // 获取提交记录
      const resp = await vm.api('online_judge_submission').get({}, {
        user: me!.user,
        page,
        page_size: 10,
      });
      vm.submissions_data = resp.data.results;
      vm.submissions_count = resp.data.count;
    }

    public async mounted() {
      const vm = this;
      const resp = await vm.api('online_judge_site').get({id: vm.$route.params.id});
      const resp2: any = await vm.api('online_judge_site').get({
        id: vm.$route.params.id, action: 'get_profile',
      }, {validate: 1}).catch(() => 0);
      vm.item = resp.data;
      vm.feature_data = Object.keys(vm.feature_map).map((key) => ({
          key,
          name: vm.feature_map[key],
          supported: vm.item!.supported_features.indexOf(key) > -1,
        }
      ));
      if (resp2) vm.profile = resp2.data;
      // 读取提交记录
      await vm.loadSubmissions();
    }
  }
</script>

<style lang="less" scoped>
  @import '../libs/less-template/template-defines';

  .section {
    padding: 15px 0;
    border-top: 1px solid #F5F5F5;
    h4.section-title {
      font-size: 16px;
      margin-bottom: 15px;
    }
    .row-pager {
      margin: 10px 0;
      text-align: right;
    }
  }

</style>
