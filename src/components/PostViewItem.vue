<template>
  <div class="post-item" v-if="item">
    <div class="post-header">
      <div class="post-title">
        <i-button v-if="item.problem" :key="item.problem"
                  size="small" @click="viewProblem(item.problem_url, item.problem)">
          {{item.problem_site_code}}{{item.problem_num}}
        </i-button>
        <router-link :to="{name:'post_view',params:{id:item.id}}">
          {{item.problem_title}}{{item.title&&' - '+item.title}}
        </router-link>
      </div>
      <div class="post-actions">
        <i-button v-if="me&&me.user===item.author"
                  size="small" type="warning" ghost
                  @click="$router.push({name:'post_edit',params:{id:item.id}})">修改
        </i-button>
        <poptip word-wrap width="120" title="确认删除？" confirm
                @on-ok="deletePost(item)">
          <i-button v-if="me&&me.user===item.author"
                    size="small" type="error" ghost>删除
          </i-button>
        </poptip>
      </div>
    </div>
    <div class="post-content">
      <div class="content" v-html="item.content"></div>
      <div class="show-less">
        <a class="btn-collapse" @click="collapse">折<br/>叠</a>
      </div>
      <div class="show-more">
        <a class="btn-expand" href="javascript:" @click="expand">展开全部</a>
      </div>
    </div>
    <div class="post-footer">
      <div class="post-categories">
        <tag v-for="cat in item.categories_item" :key="cat.id">{{cat.name}}</tag>
      </div>
      <div class="post-status">
        <div class="post-author">
          <img class="avatar" :src="item.author_avatar_url"/>
          <span class="nickname">{{item.author_nickname}}</span>
        </div>
        <div class="post-date">{{item.date_created}}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import hljs from 'highlight.js';
  import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
  import ProblemPost from '../classes/models/ProblemPost';
  import VueBase from '../classes/vue/VueBase';
  import OnlineJudgeProblem from '../classes/models/OnlineJudgeProblem';
  import Member from '../classes/models/Member';

  @Component
  export default class PostViewItem extends VueBase {
    @Prop({type: ProblemPost, required: true})
    public item?: ProblemPost;

    @Prop({type: Boolean, default: false})
    public isDetail?: boolean;

    public me: Member | null = null;

    public async renderItem() {
      const vm = this;
      vm.$nextTick(() => {
        // set hightlight
        (document.querySelectorAll('.post-item pre.ql-syntax:not(.hljs)') as any).forEach(($el: Element) => {
          hljs.highlightBlock($el);
        });
        // set collapse
        (document.querySelectorAll('.post-item .post-content:not(.rendered)') as any).forEach(($el: Element) => {
          const inHeight = $el.firstElementChild!.getBoundingClientRect().height;
          const outHeight = $el.getBoundingClientRect().height;
          // 只有当内容高于外框的时候才开启折叠
          if (!vm.isDetail && outHeight < inHeight) {
            // add class collapsable
            $el.className = $el.className.replace(/(^|\s)collapsable(\s|$)/, '') + ' collapsable';
          }
          // add class rendered
          $el.className = $el.className.replace(/(^|\s)rendered(\s|$)/, '') + ' rendered';
        });
      });
    }

    public async deletePost(item: ProblemPost) {
      const vm = this;
      await vm.api('problem_post').delete({id: item.id});
      vm.$emit('remove', item);
    }

    public async viewProblem(problemUrl: string, problemId: number) {
      window.open(problemUrl, 'problem_' + problemId);
    }

    public async collapse(e: any) {
      const $el = e.target.parentElement;
      const $out = $el.parentElement;
      $out.className = $out.className.replace(/(^|\s)expand(\s|$)/, '');
    }

    public async expand(e: any) {
      const $el = e.target.parentElement;
      const $out = $el.parentElement;
      $out.className = $out.className.replace(/(^|\s)expand(\s|$)/, '') + ' expand';
    }

    private async mounted() {
      const vm = this;
      vm.me = await vm.getCurrentUser();
      await vm.renderItem();
    }
  }
</script>

<style lang="less" scoped>
  @import '../libs/less-template/template-defines';

  .post-item {
    .clearfix();
    padding: 20px 10px;
    border-bottom: 1px solid #F5F5F5;
    .post-header {
      .clearfix();
      line-height: 36px;
      margin-bottom: 15px;
      .post-title {
        font-size: 18px;
        float: left;
        button {
          margin-right: 4px;
        }
      }
      .post-actions {
        float: right;
        button {
          margin-right: 4px;
        }
      }
    }
    .post-content {
      overflow: hidden;
      position: relative;
      max-height: 380px;
      .transition-duration(0.5s);
      &.collapsable {
        .show-more {
          display: block;
        }
        &.expand .show-less {
          display: block;
        }
      }
      &.rendered:not(.collapsable) {
        max-height: none;
      }
      &.expand {
        max-height: 9999px;
        .show-more {
          display: none;
        }
      }
      .show-less {
        display: none;
        .btn-collapse {
          position: absolute;
          display: block;
          background: white;
          padding: 10px 4px;
          border: 1px solid #2d8cf0;
          border-radius: 5px 0 0 5px;
          color: #2d8cf0;
          right: 0;
          top: 20px;
          line-height: 1em;
          height: 2em;
          box-sizing: content-box;
          opacity: 0.7;
          .transition-duration(0.5s);
          &:hover {
            opacity: 1;
          }
        }
      }
      .show-more {
        display: none;
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        &::before {
          content: "";
          position: absolute;
          height: 100px;
          bottom: 0;
          left: 0;
          right: 0;
          display: block;
          background: svg-gradient(to bottom, fade(white, 0), white);
        }
        .btn-expand {
          display: block;
          margin: 10px auto;
          width: 5em;
          color: #2d8cf0;
          border: 1px solid #2d8cf0;
          text-align: center;
          border-radius: 4px;
          background: white;
          position: relative;
          opacity: 0.7;
          .transition-duration(0.5s);
          &:hover {
            opacity: 1;
          }
        }
      }
      .content {
      }
    }
    .post-footer {
      margin-top: 20px;
      .clearfix();
      .post-categories {
        float: left;
        margin-bottom: 6px;
      }
      .post-status {
        float: right;
        text-align: left;
        /*width: 180px;*/
        .post-author {
          line-height: 24px;
          img.avatar {
            width: 24px;
            height: 24px;
            display: inline-block;
            vertical-align: middle;
            margin-right: 10px;
          }
        }
        .post-date {
          font-size: 12px;
          line-height: 24px;
          color: #888888;
        }
      }
    }
  }
</style>
