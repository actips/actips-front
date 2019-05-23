<template>
  <div class="sub-page-personal-profile" v-if="me">
    <div class="block-avatar">
      <a class="avatar">
        <img :src="me.avatar_url"/>
      </a>
    </div>
    <div class="block-form">
      <!-- 基本资料 -->
      <h3 class="block-title">基础资料</h3>
      <i-form :model="me">
        <!--<form-item label="头像" :label-width="180">-->
        <!--<i-input v-model="me.avatar_url"></i-input>-->
        <!--</form-item>-->
        <form-item label="用户名" :label-width="150">
          <i-input v-model="me.username"></i-input>
        </form-item>
        <form-item label="昵称" :label-width="150">
          <i-input v-model="me.nickname"></i-input>
        </form-item>
        <form-item label="性别" :label-width="150">
          <i-select v-model="me.gender" placeholder="保密">
            <i-option value="M">男</i-option>
            <i-option value="F">女</i-option>
            <i-option value="">不告诉你</i-option>
          </i-select>
        </form-item>
        <form-item label="出生日期" :label-width="150">
          <date-picker v-model="me.birthday" type="date" format="yyyy-MM-dd"/>
        </form-item>
        <div class="block-submit">
          <i-button type="primary" @click="submitBasic()">保存</i-button>
        </div>
      </i-form>
    </div>
    <!--<div class="block-form">-->
    <!--<h3 class="block-title">账户绑定</h3>-->
    <!--<i-form :model="me">-->
    <!--&lt;!&ndash; TODO: 实现手机号绑定功能 &ndash;&gt;-->
    <!--<form-item label="手机号" :label-width="150">-->
    <!--<i-input v-model="me.mobile"/>-->
    <!--</form-item>-->
    <!--&lt;!&ndash; TODO: 实现邮箱绑定功能 &ndash;&gt;-->
    <!--<form-item label="邮箱" :label-width="150">-->
    <!--<i-input v-model="me.email"/>-->
    <!--</form-item>-->
    <!--</i-form>-->
    <!--</div>-->
    <div class="block-form">
      <h3 class="block-title">修改密码</h3>
      <i-form :model="me">
        <form-item label="新密码" :label-width="150">
          <i-input type="password" v-model="password"></i-input>
        </form-item>
        <form-item label="重复密码" :label-width="150">
          <i-input type="password" v-model="password2"></i-input>
        </form-item>
      </i-form>
      <div class="block-submit">
        <i-button type="primary" @click="submitPassword()">保存</i-button>
      </div>
    </div>
    <!--<div class="block-form">-->
    <!--<h3 class="block-title">第三方凭据</h3>-->
    <!--<i-form :model="me">-->
    <!--<form-item label="新密码" :label-width="150">-->
    <!--<i-input v-model="password"></i-input>-->
    <!--</form-item>-->
    <!--<form-item label="重复密码" :label-width="150">-->
    <!--<i-input v-model="password2"></i-input>-->
    <!--</form-item>-->
    <!--</i-form>-->
    <!--</div>-->
  </div>
</template>

<script lang="ts">
  import moment from 'moment';
  import {Component, Vue} from 'vue-property-decorator';
  import VueBase from '../classes/vue/VueBase';
  import Member from '../classes/models/Member';

  @Component
  export default class PersonalProfile extends VueBase {
    public me: Member | null = null;
    public password = '';
    public password2 = '';

    public async submitBasic() {
      const vm = this;
      if (!vm.me) {
        return;
      }
      await vm.api('member').post({
        action: 'update_profile',
      }, {
        username: vm.me.username,
        nickname: vm.me.nickname,
        gender: vm.me.gender,
        birthday: vm.me.birthday ? moment(vm.me.birthday).format('YYYY-MM-DD') : null,
      });
      vm.me = await vm.getCurrentUser(true);
    }

    public async submitPassword() {
      const vm = this;
      if (vm.password.length < 6) {
        vm.$Message.warning('密码不得少于6位');
        return;
      } else if (vm.password !== vm.password2) {
        vm.$Message.warning('两次输入的密码不相符');
        return;
      }
      await vm.api('member').post({
        action: 'update_password',
      }, {
        password: vm.password,
      });
      vm.password2 = '';
      vm.password = '';
    }

    private async mounted() {
      const vm = this;
      vm.me = await vm.getCurrentUser(true);
    }

  }
</script>

<style lang="less" scoped>
  @import "../libs/less-template/template-defines";

  .sub-page-personal-profile {
    background: #f5f5f5;
    margin: 0 -21px;
    padding-bottom: 20px;
    .clearfix();
  }

  .block-avatar {
    text-align: center;
    margin: 20px 0;
    a.avatar {
      display: inline-block;
      .circle();
      border: 1px solid #DDDDDD;
      img {
        display: block;
        .circle();
        width: 132px;
        height: 132px;
        border: 5px solid white;
        overflow: hidden;
      }
    }
  }

  .block-form {
    width: 600px;
    margin: 20px auto;
    padding: 10px 100px 20px 0;
    background: white;
    border: 3px solid #F5F5F5;
    border-radius: 5px;
    h3.block-title {
      margin: 0 0 10px 50px;
      font-size: 16px;
      line-height: 45px;
    }
  }

  .block-submit {
    text-align: right;
  }
</style>
