import Vue from 'vue';
import {Component, Watch} from 'vue-property-decorator';
import GlobalContext from '@/classes/utils/GlobalContext';
import ApiResource from '@/classes/utils/ApiResource';
import Member from '@/classes/models/Member';
import VueRoot from '@/classes/vue/VueRoot';
import moment from 'moment';

export default class VueBase extends Vue {

  public defaultHtmlTitle = 'ACTips.org - 为 ACMer\'s 量身定造的成长社区';

  get ctx(): GlobalContext {
    return (this.$root as VueRoot).globalContext;
  }

  set htmlTitle(title: string) {
    const vm = this;
    if (title !== vm.defaultHtmlTitle) {
      title += ' - ACTips.org';
    }
    document.getElementsByTagName('title')[0].innerText = title;
  }

  // public async reload() {
  //   // 子类实现
  //   console.log('you');
  // }
  //
  // public async mounted() {
  //   const vm = this;
  //   await vm.reload();
  // }
  //
  // @Watch('$route')
  // public async beforeRouteUpdate(to: any, from: any) {
  //   const vm = this;
  //   await vm.reload();
  // }

  // 从性能角度来看，可以考虑将多次的构造缓存下来，支持重复使用
  public api(model: string, apiRoot = '', apiFormat = '') {
    const vm: Vue = this;
    const resource = new ApiResource(model, apiRoot, apiFormat, vm);
    // 保留 vm 的引用
    resource.vm = vm;
    return resource;
  }

  /**
   * 根据传入的 ticket 登录用户（自动注册）
   * @param {string} ticket
   * @returns {Promise<void>}
   */
  public async loginWithTicket(ticket: string) {
    const vm = this;
    await vm.api('member').post({action: 'login_with_ticket'}, {ticket});
    vm.$router.push({query: {}});
  }

  /**
   * 注销当前登录
   * @returns {Promise<void>}
   */
  public async logout() {
    const vm = this;
    await vm.api('member').post({action: 'logout'}, {});
    vm.ctx.me = null;
  }

  /**
   * 获取当前登录的用户
   * @param {boolean} reload 是否强制更新
   * @returns {Promise<Member>}
   */
  public async getCurrentUser(reload = false) {
    const vm = this;
    if (reload || !vm.ctx.me) {
      const resp = await vm.api('member').get({action: 'current'})
        .then((x) => x, () => null);
      vm.ctx.me = resp ? new Member(resp.data) : null;
    }
    return vm.ctx.me;
  }

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

  // 工具函数
  public prettyDate(date: string | Date) {
    const now = new Date();
    const then = new Date(date);
    const seconds = Math.floor((Number(now) - Number(then)) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    if (minutes <= 3) {
      return '刚刚';
    } else if (hours < 1) {
      return minutes + '分钟前';
    } else if (hours < 12) {
      return hours + '小时前';
    } else if (days < 1) {
      return '今天';
    } else if (days <= 3) {
      return days + '天前';
    } else {
      return moment(date).format('YYYY-MM-DD HH:mm:ss');
      // return '很久以前';
    }
  }

}

