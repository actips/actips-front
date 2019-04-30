<template>
  <div v-if="item">
    <header class="page-header">
      <h2 class="title">发布题解</h2>
      <div class="actions">
        <i-button type="default" @click="$router.back()">返回</i-button>
        <i-button type="primary" @click="submit()">提交</i-button>
      </div>
    </header>
    <div class="page-content">
      <i-form :model="item">
        <form-item label="标题" :label-width="180">
          <i-input v-model="item.title"></i-input>
        </form-item>
        <form-item label="是否原创" :label-width="180" class="field-origin">
          <checkbox :value="item.origin_link===null" @input="changeOriginal">
            <span class="description">为尊重原作者及避免重复，转载请注明来源。</span>
          </checkbox>
        </form-item>
        <form-item label="原文链接" :label-width="180" v-if="item.origin_link!==null">
          <i-input v-model="item.origin_link"
                   :disabled="item.origin_link===null"></i-input>
        </form-item>
        <form-item label="对应题目" :label-width="180" required>
          <tag v-if="item.problem" :name="item.problem_site_code+item.problem.num" closable
               @on-close="removeProblem">{{item.problem_site_code+item.problem_num}}
          </tag>
          <i-button v-else
                    icon="ios-add" type="dashed" size="small"
                    @click="addProblem(0)">添加题目
          </i-button>
        </form-item>
        <form-item label="其他关联题目" :label-width="180">
          <tag v-for="(problem,i) in item.problems_related_item"
               :key="problem.id" :name="problem.site_code+problem.num" closable
               @on-close="removeProblemRelated(i)">{{problem.site_code+problem.num}}
          </tag>
          <i-button v-if="item.problems_related.length < 5"
                    icon="ios-add" type="dashed" size="small"
                    @click="addProblem(1)">添加题目
          </i-button>
        </form-item>
        <form-item label="分类标签" :label-width="180" required>
          <tag v-for="(category,i) in item.categories_item"
               :key="category.id" :name="category.id" closable
               @on-close="removeCategory(i)">
            {{category.name}}
          </tag>
          <i-button icon="ios-add" type="dashed" size="small"
                    @click="addCategory()">添加标签
          </i-button>
        </form-item>
        <form-item label="难度评分" :label-width="180" class="field-rating">
          <rate v-model="item.rating_difficulty" clearable style="margin-top: -4px"/>
          <span class="description">
            {{['未评分','水题','简单题','基础理论','需要组合/变通求解','特别难解'][Number(item.rating_difficulty)]}}
            ({{item.rating_difficulty}})
          </span>
        </form-item>
        <form-item label="正文" :label-width="180">
          <quill-editor v-model="item.content"
                        :options="editorOptions"></quill-editor>
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
        :width="400"
        :mask-closable="false"
        @on-ok="modalCategoriesOk"
        :footer-hide="false">
      <cascader v-model="modalCategoriesValue" filterable
                :data="modalCategoriesCascaderData"></cascader>
      <!--<transfer-->
      <!--:titles="['题目分类', '已选(≤5个)']"-->
      <!--:data="listCategoriesTransferData"-->
      <!--filterable-->
      <!--:list-style="{width: '250px', height: '320px'}"-->
      <!--:target-keys="item.categories"-->
      <!--@on-change="listCategoriesOnChange">-->
      <!--</transfer>-->
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

  import Quill from 'quill';
  import container from '@/libs/quill-image-extend-module/container';
  import QuillWatch from '@/libs/quill-image-extend-module/QuillWatch';
  import ImageExtend from '@/libs/quill-image-extend-module/ImageExtend';

  Quill.register('modules/ImageExtend', ImageExtend);

  @Component({})
  export default class Home extends VueBase {
    public item = new ProblemPost();

    // 选择OJ题目
    public showModalProblems = false;
    public listOJSites: OnlineJudgeSite[] = [];
    public modalProblemsSiteId = 0;
    public modalProblemsNum = '';
    public modalProblemsProblem: OnlineJudgeProblem | null = null;
    public addMode = 0; // 0 for problem, 1 for problems_related
    public pingWaiting = false;

    // 选择分类标签
    public showModalCategories = false;
    public modalCategoriesValue = [];
    public listCategories: ProblemCategory[] = [];
    public mapCategories: { [key: number]: ProblemCategory } = {};

    // 提交
    public submitWaiting = false;

    public editorOptions = {
      modules: {
        // toolbar: [
        //   'bold', 'italic', 'underline', 'strike',
        //   'link', 'image', 'video',
        //   { align: [] }, { color: [] }, { background: [] }
        //   // image() {
        //   //   QuillWatch.emit(this.quill.id)
        //   // },
        // ],
        toolbar: {
          container,
          handlers: {
            image() {
              QuillWatch.emit((this as any).quill.id);
            },
          },
        },
        ImageExtend: {
          loading: true,
          name: 'img',
          action: this.ctx.config.apiRoot.replace(/\/$/, '') + '/image/',
          change(xhr: any, formData: any) {
            // console.log('change', arguments);
            const file = formData.get('img');
            // console.log(file);
            formData.delete('img');
            formData.append('image', file);
          },
          // start () {
          //   console.log('start', arguments)
          // },
          // end () {
          //   console.log('end', arguments)
          // },
          // error () {
          //   console.log('error', arguments)
          // },
          // success () {
          //   console.log('success', arguments)
          // },
          response(resp: any) {
            return resp.url;
          },
        },
      },
    };

    public get modalCategoriesCascaderData(): any[] {
      const vm = this;
      const ans: any[] = [];
      const map: any = {};
      vm.listCategories.forEach((cat) => {
        map[cat.id] = {value: cat.id, label: cat.name};
      });
      vm.listCategories.forEach((cat) => {
        if (cat.parent) {
          if (!map[cat.parent].children) {
            map[cat.parent].children = [];
          }
          map[cat.parent].children.push(map[cat.id]);
        } else {
          ans.push(map[cat.id]);
        }
      });
      return ans;
    }

    // public get listCategoriesTransferData() {
    //   const vm = this;
    //   return vm.listCategories.map((item) => ({
    //     key: item.id,
    //     label: (item.seq.length === 12 ? '　　└─ ' : item.seq.length === 8 ? '└─ ' : '') + item.name,
    //     description: '',
    //     disabled: '',
    //   }));
    // }

    public changeOriginal(value: any) {
      const vm = this;
      vm.item.origin_link = value ? null : '';
    }

    public async submit() {
      const vm = this;
      if (vm.submitWaiting) {
        vm.$Message.warning('正在提交，请勿频繁点击...');
        return;
      }
      // 前置校验
      if (vm.item.content.replace(/\s/g, '').length < 30) {
        vm.$Message.warning('写个题解怎么着总得有个30字吧～');
        return;
      }
      // 执行提交
      vm.submitWaiting = true;
      if (vm.item.id) {
        await vm.api('problem_post').patch({id: vm.item.id}, vm.item).then(() => {
          vm.$router.push({name: 'home'});
        }, () => 0);
      } else {
        await vm.api('problem_post').post(vm.item).then(() => {
          vm.$router.push({name: 'home'});
        }, () => 0);
      }
      vm.submitWaiting = false;
    }

    public async addProblem(addMode: number) {
      const vm = this;
      // 清除旧的选项
      vm.modalProblemsNum = '';
      vm.modalProblemsSiteId = 0;
      vm.modalProblemsProblem = null;
      // 打开对话框
      vm.showModalProblems = true;
      vm.addMode = addMode;
    }

    public async confirmProblemAdd() {
      const vm = this;
      if (!vm.modalProblemsProblem) {
        vm.$Message.info('还没有匹配到题目');
        return;
      }
      if (vm.addMode === 0) {
        vm.item.problem = vm.modalProblemsProblem.id;
        vm.item.problem_num = vm.modalProblemsProblem.num;
        vm.item.problem_site_code = vm.modalProblemsProblem.site_code;
      } else if (vm.addMode === 1) {
        if (vm.modalProblemsProblem.id) {
          if (vm.item.problems_related.indexOf(vm.modalProblemsProblem.id) > -1) {
            vm.$Message.info('你已经添加过这道题目');
            return;
          }
          if (vm.item.problems_related.length > 3) {
            vm.$Message.error('最多不能绑定超过三道题目');
          }
          vm.item.problems_related.push(vm.modalProblemsProblem.id);
          vm.item.problems_related_item.push(vm.modalProblemsProblem);
        }
      } else {
        vm.$Message.error('模式错误');
      }
      // 关闭弹窗
      vm.showModalProblems = false;
    }

    public async removeProblem() {
      const vm = this;
      vm.item.problem = 0;
      vm.item.problem_num = '';
      vm.item.problem_site_code = '';
    }

    public async removeProblemRelated(index: number) {
      const vm = this;
      vm.item.problems_related.splice(index, 1);
      vm.item.problems_related_item.splice(index, 1);
    }

    public async loadListOJSites() {
      const vm = this;
      const resp = await vm.api('online_judge_site').get({}, {page_size: 0});
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
        // vm.$Message.error('没有匹配到输入的题目');
        vm.modalProblemsProblem = null;
      });
      vm.$nextTick(() => {
        if (vm.$refs.cardProblem) {
          (vm.$refs.cardProblem as Vue).$forceUpdate();
        }
      });
      vm.pingWaiting = false;
    }

    public async addCategory() {
      const vm = this;
      // 展开对话框
      vm.showModalCategories = true;
    }

    public async loadListCategories() {
      const vm = this;
      const resp = await vm.api('problem_category').get({}, {page_size: 0, ordering: 'id'});
      vm.listCategories = resp.data.results.map((item: any) => new ProblemCategory(item));
      // 计算字典
      const items: { [key: number]: ProblemCategory } = {};
      vm.listCategories.forEach((item) => {
        items[item.id!] = item;
      });
      vm.mapCategories = items;
    }

    // public async listCategoriesOnChange(keys: number[]) {
    //   const vm = this;
    //   if (keys.length > 5) {
    //     vm.$Message.warning('不能选取超过5个分类');
    //     return;
    //   }
    //   vm.item.categories = keys;
    //   // 映射到分类对象
    //   vm.item.categories_item =
    //     keys.map((key: number) => vm.mapCategories[key]).filter((item: any) => !!item);
    // }
    public async modalCategoriesOk() {
      const vm = this;
      if (vm.modalCategoriesValue.length) {
        const cat = vm.mapCategories[
          vm.modalCategoriesValue[vm.modalCategoriesValue.length - 1]];
        if (vm.item.categories.indexOf(cat.id) > -1) {
          return false;
        }
        vm.item.categories.push(cat.id);
        vm.item.categories_item.push(cat);
      }
      return false;
    }

    public async removeCategory(index: number) {
      const vm = this;
      vm.item.categories.splice(index, 1);
      vm.item.categories_item.splice(index, 1);
    }

    private async mounted() {
      const vm = this;
      // 没登录是不允许发布的，如果有，跳转到登录
      const me = await vm.getCurrentUser();
      if (!me) {
        vm.loginWechat();
      }
      // 读取题目列表
      await this.loadListCategories();
      // 读取OJ列表
      await this.loadListOJSites();
      // 加载 post 对象
      const id = Number(vm.$route.params['id'] || 0);
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
      button {
        margin-left: 4px;
      }
    }
  }

  .page-content {
    .field-origin, .field-rating {
      .description {
        color: #AAA;
        margin-left: 5px;
      }
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

