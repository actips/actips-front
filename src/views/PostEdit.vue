<template>
  <div v-if="item">
    <header class="page-header">
      <h2 class="title">发布题解</h2>
      <div class="actions">
        <i-button type="primary" @click="submit()">提交</i-button>
      </div>
    </header>
    <div class="page-content">
      <i-form :model="item">
        <form-item label="标题" :label-width="180">
          <i-input v-model="item.title"></i-input>
        </form-item>
        <form-item label="摘要" :label-width="180" required>
          <i-input type="textarea" v-model="item.excerpt"
                   :rows="2"></i-input>
        </form-item>
        <form-item label="OJ题目" :label-width="180" required>
          <tag v-for="(problem,i) in item.problems_item"
               :key="problem.id" :name="problem.site_code+problem.num" closable
               @on-close="removeProblem(i)">{{problem.site_code+problem.num}}
          </tag>
          <i-button icon="ios-add" type="dashed" size="small"
                    @click="addProblem()">添加题目
          </i-button>
        </form-item>
        <form-item label="分类标签" :label-width="180" required>
          <tag v-for="(category,i) in item.categories_item"
               :key="category.id" :name="category.id" closable
               @on-close="removeCategory(i)">{{category.name}}
          </tag>
          <i-button icon="ios-add" type="dashed" size="small"
                    @click="addCategory()">添加标签
          </i-button>
        </form-item>
        <form-item label="正文" :label-width="180">
          <i-input type="textarea" v-model="item.excerpt"
                   :rows="20"></i-input>
        </form-item>
      </i-form>
    </div><!-- .page-content -->
    <!--<problem-category-selector-->
    <!--:show="showModalCategory"/>-->

    <!--TODO: 暂时图快，后期的话一旦出现需要复用就重构成模块-->
    <modal
        v-model="showModalCategories"
        class="modal-categories"
        title="分类标签"
        :mask-closable="false"
        @on-ok="onOkModalCategories()"
        @on-cancel="onCancelModalCategories()">
      <transfer
          :titles="['可选分类', '已选(≤5个)']"
          :data="listCategoriesTransferData"
          filterable
          :target-keys="item.categories"
          @on-change="listCategoriesOnChange">
      </transfer>
    </modal>

    <!--TODO: 暂时图快，后期的话一旦出现需要复用就重构成模块-->
    <modal
        v-model="showModalProblems"
        class="modal-problems"
        title="关联题目"
        :closable="false"
        :footer-hide="true">
      <i-form inline @keydown.native.enter.prevent>
        <form-item>
          <i-select v-model="modalProblemsSiteId">
            <i-option v-for="site in listOJSites"
                      :value="site.id"
                      :key="site.id">[{{site.code}}] {{site.name}}
            </i-option>
          </i-select>
        </form-item>
        <form-item>
          <i-input v-model="modalProblemsNum"
                   @on-enter="pingProblem"/>
        </form-item>
        <form-item>
          <i-button type="primary" shape="circle" icon="ios-search"
                    @click="pingProblem"/>
        </form-item>
      </i-form>
      <div class="problem-title" v-if="modalProblemsProblem">
        [{{modalProblemsProblem.site_code}}{{modalProblemsProblem.num}}]
        {{modalProblemsProblem.title}}
        <div class="actions">
          <i-button type="success" @click="confirmProblemAdd"
                    size="small">添加
          </i-button>
        </div>
      </div>
      <card style="max-height: 400px; overflow: auto"
            ref="cardProblem" :dis-hover="true">
        <template v-if="modalProblemsProblem">
          <div v-html="modalProblemsProblem.content"></div>
        </template>
        <template v-else-if="pingWaiting">正在获取，请勿频繁点击...</template>
        <template v-else>请选择OJ并输入精确的OJ题号进行查找</template>
      </card>
    </modal>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import ProblemPost from '../classes/models/ProblemPost';

  import VueBase from '../classes/vue/VueBase';
  import ProblemCategory from '../classes/models/ProblemCategory';
  import OnlineJudgeSite from '../classes/models/OnlineJudgeSite';
  import OnlineJudgeProblem from '../classes/models/OnlineJudgeProblem';

  @Component({})
  export default class Home extends VueBase {
    public item: ProblemPost | null = null;

    // 选择OJ题目
    public showModalProblems = false;
    public listOJSites: OnlineJudgeSite[] = [];
    public modalProblemsSiteId = 0;
    public modalProblemsNum = '';
    public modalProblemsProblem: OnlineJudgeProblem | null = null;
    public pingWaiting = false;

    // 选择分类标签
    public showModalCategories = false;
    public listCategories: ProblemCategory[] = [];
    public mapCategories: { [key: number]: ProblemCategory } = {};

    public get listCategoriesTransferData() {
      const vm = this;
      return vm.listCategories.map((item) => ({
        key: item.id,
        label: item.name,
        description: '',
        disabled: '',
      }));
    }

    public async submit() {
      return;
    }

    public async addProblem() {
      const vm = this;
      // 清除旧的选项
      vm.modalProblemsNum = '';
      vm.modalProblemsSiteId = 0;
      vm.modalProblemsProblem = null;
      // 打开对话框
      vm.showModalProblems = true;
    }

    public async removeProblem(index: number) {
      const vm = this;
      if (vm.item) {
        vm.item.problems.splice(index, 1);
        vm.item.problems_item.splice(index, 1);
      }
    }

    public async loadListOJSites() {
      const vm = this;
      const resp = await vm.api('online_judge_site').get({page_size: 0});
      vm.listOJSites = resp.data.results.map((item: any) => new OnlineJudgeSite(item));
    }

    public async pingProblem() {
      const vm = this;
      if (vm.pingWaiting) {
        vm.$Message.warning('正在获取，请勿频繁点击...');
        return;
      }
      if (!vm.modalProblemsSiteId) {
        vm.$Message.warning('请选择OJ站点');
        return;
      }
      if (!vm.modalProblemsNum.trim()) {
        vm.$Message.warning('请输入题目编号');
        return;
      }
      vm.pingWaiting = true;
      await vm.api('online_judge_site').post({
        id: vm.modalProblemsSiteId, action: 'ping_problem',
      }, {
        num: vm.modalProblemsNum.trim(),
      }).then((resp) => {
        vm.modalProblemsProblem = resp.data;
      }, () => {
        vm.$Message.error('没有匹配到输入的题目');
        vm.modalProblemsProblem = null;
      });
      vm.$nextTick(() => {
        if (vm.$refs.cardProblem) {
          (vm.$refs.cardProblem as Vue).$forceUpdate();
        }
      });
      vm.pingWaiting = false;
    }

    public async confirmProblemAdd() {
      const vm = this;
      if (vm.item.problems.indexOf(vm.modalProblemsProblem.id) > -1) {
        vm.$Message.info('你已经添加过这道题目');
        return;
      }
      if (vm.item.problems.length > 3) {
        vm.$Message.error('最多不能绑定超过三道题目');
      }
      vm.item.problems.push(vm.modalProblemsProblem.id);
      vm.item.problems_item.push(vm.modalProblemsProblem);
      vm.showModalProblems = false;
    }

    public async addCategory() {
      const vm = this;
      // 展开对话框
      vm.showModalCategories = true;
    }

    public async loadListCategories() {
      const vm = this;
      const resp = await vm.api('problem_category').get({page_size: 0});
      vm.listCategories = resp.data.results.map((item: any) => new ProblemCategory(item));
      // 计算字典
      const items: { [key: number]: ProblemCategory } = {};
      vm.listCategories.forEach((item) => {
        items[item.id!] = item;
      });
      vm.mapCategories = items;
    }

    public async listCategoriesOnChange(keys: number[]) {
      const vm = this;
      if (!vm.item) {
        return;
      }
      if (keys.length > 5) {
        vm.$Message.warning('不能选取超过5个分类');
        return;
      }
      vm.item.categories = keys;
      // 映射到分类对象
      vm.item.categories_item =
        keys.map((key: number) => vm.mapCategories[key]).filter((item: any) => !!item);
    }

    public async removeCategory(index: number) {
      const vm = this;
      if (vm.item) {
        vm.item.categories.splice(index, 1);
        vm.item.categories_item.splice(index, 1);
      }
    }

    public async onOkModalCategories() {
      return;
    }

    public async onCancelModalCategories() {
      return;
    }

    private async mounted() {
      const vm = this;
      const id = Number(vm.$route.params['id'] || 0);
      // 读取题目列表
      await this.loadListCategories();
      // 读取OJ列表
      await this.loadListOJSites();
      // 加载 post 对象
      if (id) {
        const resp = await vm.api('problem_post').get({id});
        vm.item = resp.data;
      } else {
        vm.item = new ProblemPost({});
      }
    }
  }
</script>

<style lang="less" scoped>
  header.page-header {
    line-height: 48px;
    border-bottom: 1px solid #F5F5F5;
    margin-bottom: 20px;
    h2.title {
      font-size: 15px;
      font-weight: bold;
      display: inline-block;
    }
    .actions {
      float: right;
    }
  }

  .modal-problems {
    .problem-title {
      margin-bottom: 15px;
      font-size: 14px;
      font-weight: bold;
      color: #2d8cf0;
      .actions {
        float: right;
      }
    }
  }
</style>

