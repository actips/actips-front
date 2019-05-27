<template>
  <div class="block-comments">
    <ul class="comment-list">
      <li class="comment-item" v-for="comment in comments">
        <span class="reply-to" v-if="comment.parent">@{{comment.parent_nickname}}: </span>
        {{comment.content}}
        <!-- TODO: 点击要链接到用户的个人页面 -->
        <a class="comment-author">{{comment.author_nickname}}</a>
        <span class="comment-date">{{prettyDate(comment.date_created)}}</span>
        <poptip word-wrap width="120" title="确认删除？" confirm
                v-if="comment.author===ctx.me.user"
                @on-ok="deleteComment(comment)">
          <a class="btn-delete" href="javascript:">删除</a>
        </poptip>
        <a class="btn-reply" href="javascript:" v-else-if="editable"
           @click="parent=comment">回复</a>
      </li>
    </ul>
    <div class="form-make-comment" v-if="editable">
      <!-- TODO: 加入 emoji 选择器 -->
      <i-input type="textarea" v-model="content"
               class="comment-input" :rows="4"></i-input>
      <div class="info">
        <a class="reply-to" v-if="parent" href="javascript:"
           @click="parent=null">@{{parent.author_nickname}}</a>
        <span class="notice" :class="{exceed:remainLength<0}">
          最多{{maxLength}}字，还剩{{remainLength}}字</span>
        <i-button class="btn-submit" type="default" size="small"
                  :disabled="remainLength<0"
                  @click="submit">提交评论
        </i-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import {Component, Prop, Vue, Watch} from 'vue-property-decorator';
  import ProblemPost from '../classes/models/ProblemPost';
  import VueBase from '../classes/vue/VueBase';
  import Member from '../classes/models/Member';
  import Comment from '../classes/models/Comment';

  @Component
  export default class PostViewItem extends VueBase {
    @Prop({type: Number, required: true})
    public post?: number;

    @Prop({type: Boolean, default: false})
    public editable?: boolean;

    public parent: Comment | null = null;

    // @Prop({type: Member | null})
    // public me: Member | null;

    public comments: Comment[] = [];

    public content = '';

    public maxLength = 150;

    public get remainLength() {
      return this.maxLength - this.content.length;
    }

    public async renderItem() {
      const vm = this;
      // const vm.comments =
      const resp = await vm.api('comment').get({}, {
        // TODO: 这里需要做成分页加载
        page_size: 0,
        object_id: vm.post,
        // TODO: 尚未核实这个筛选条件行不行得通
        content_type__model: 'problempost',
      });
      vm.comments = resp.data.results;
    }

    public async deleteComment(comment: Comment) {
      const vm = this;
      await vm.api('comment').delete({id: comment.id});
      vm.$emit('remove', comment);
      await vm.renderItem();
    }

    public async submit() {
      const vm = this;
      const payload = {
        content: vm.content,
        object_id: vm.post,
        content_type: 'core.problempost',
        parent: vm.parent ? vm.parent.id : null,
      };
      await vm.api('comment').post(payload);
      // 动作完成之后重新加载
      await vm.renderItem();
      vm.content = '';
    }

    public async mounted() {
      const vm = this;
      await vm.renderItem();
    }
  }
</script>

<style lang="less" scoped>
  @import '../libs/less-template/template-defines';

  .block-comments {
    .clearfix();
    font-size: 14px;
    ul.comment-list {
      padding: 10px 0;
      li.comment-item {
        font-size: 14px;
        padding: 3px 9px;
        line-height: 18px;
        .reply-to {
          color: #2d8cf0;
        }
        a.comment-author {
          margin-left: 10px;
          color: #2d8cf0;
        }
        .comment-date {
          margin-left: 5px;
          font-size: 12px;
          color: #AAA;
        }
        a.btn-delete {
          color: #ed4014;
          margin-left: 10px;
          opacity: 0;
          font-size: 12px;
          .transition(opacity, 0.2s);
        }
        a.btn-reply {
          color: #2d8cf0;
          margin-left: 10px;
          opacity: 0;
          font-size: 12px;
          .transition(opacity, 0.2s);
        }
        &:hover {
          a.btn-reply, a.btn-delete {
            opacity: 1;
          }
        }
      }
    }
    .form-make-comment {
      .comment-input {
      }
      .info {
        .clearfix();
        margin: 6px 0 0 0;
        .reply-to {
          color: #2d8cf0;
        }
        .notice {
          &.exceed {
            color: #ed4014;
          }
        }
        .btn-submit {
          float: right;
        }
      }
    }
  }
</style>

