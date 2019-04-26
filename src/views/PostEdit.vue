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
                 :key="problem.id" :name="problem.code" closable
                 @on-close="removeProblem(i)">{{problem.code}}
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
        title="分类标签"
        @on-ok="onOkModalCategories()"
        @on-cancel="onCancelModalCategories()">
      <transfer
          :titles="['可选分类', '已选(≤5个)']"
          :data="listCategoriesTransferData"
          filterable
          :target-keys="item.categories"
          @on-change="listCategoriesOnChange">
      </transfer>
      <!--<i-transfer-->
      <!--:data=-->
      <!--&gt;</i-transfer>-->
    </modal>

    <!--TODO: 暂时图快，后期的话一旦出现需要复用就重构成模块-->
    <modal
        v-model="showModalProblems"
        title="关联题目"
        @on-ok="onOkModalProblems()"
        @on-cancel="onCancelModalProblems()">
      haha
      <!--<i-transfer-->
      <!--:data=-->
      <!--&gt;</i-transfer>-->
    </modal>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import ProblemPost from '../classes/models/ProblemPost';

  import VueBase from '../classes/vue/VueBase';
  import ProblemCategory from '../classes/models/ProblemCategory';

  @Component({})
  export default class Home extends VueBase {
    public item: ProblemPost | null = null;

    // 选择OJ题目
    public showModalProblems = false;

    // 选择分类标签
    public showModalCategories = false;
    public listCategories: ProblemCategory[] = [];
    public mapCategoires: { [key: number]: ProblemCategory } = {};

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
      vm.showModalProblems = true;
    }

    public async removeProblem(index: number) {
      const vm = this;
      if (vm.item) {
        vm.item.problems.splice(index, 1);
        vm.item.problems_item.splice(index, 1);
      }
    }

    public async onOkModalProblems() {
      return;
    }

    public async onCancelModalProblems() {
      return;
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
      vm.mapCategoires = items;
    }

    public async listCategoriesOnChange(keys: number[]) {
      const vm = this;
      if (!vm.item) return;
      if (keys.length > 5) {
        vm.$Message.warning('不能选取超过5个分类');
        return;
      }
      vm.item.categories = keys;
      // 映射到分类对象
      vm.item.categories_item =
        keys.map((key: number) => vm.mapCategoires[key]).filter((item: any) => !!item);
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
</style>

