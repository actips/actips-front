import Vue from 'vue';
import GlobalContext from '@/classes/utils/GlobalContext';
import ApiResource from '@/classes/utils/ApiResource';
import Member from '@/classes/models/Member';
import VueRoot from '@/classes/vue/VueRoot';

export default class VueBase extends Vue {

  get ctx(): GlobalContext {
    return (this.$root as VueRoot).globalContext;
  }

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

}

