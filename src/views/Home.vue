<template>
  <div>
    <div class="page-header">
      <i-form inline class="filtering">
        <form-item>
          <i-select></i-select>
        </form-item>
        <form-item>
          <i-select></i-select>
        </form-item>
        <form-item>
          <i-input></i-input>
        </form-item>
      </i-form>
      <div class="actions">
        <i-button @click="$router.push({name:'post_edit', params:{id:0}})"
                  type="primary">发布题解
        </i-button>
      </div>
    </div>
    <div class="page-body">
      <ul class="post-list">
        <li v-for="item in items" class="post-item">
          <div class="post-title">
            <i-button v-for="problem in item.problems_item" :key="problem.id"
                      size="small" @click="viewProblem(problem)">
              {{problem.site_code}}{{problem.num}}
            </i-button>
            {{item.title}}
          </div>
          <div class="post-excerpt">
            <pre>{{item.excerpt}}</pre>
          </div>
          <div class="post-content">
            <div class="content" v-html="item.content"></div>
          </div>
          <div class="post-footer">
            <div class="post-actions">
              <!-- TODO: post_view 未实现 -->
              <i-button size="small" type="info" ghost
                        @click="$router.push({name:'post_view',params:{id:item.id}})">查看
              </i-button>
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
            <div class="post-status">
              <div class="post-date">{{item.date_created}}</div>
              <div class="post-author">
                <img class="avatar" :src="item.author_avatar_url"/>
                <span class="nickname">{{item.author_nickname}}</span>
              </div>
            </div>
          </div>
        </li>
      </ul>
      <div v-if="hasMore" class="block-more">
        <i-button size="large" @click="loadItems">加载更多</i-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import ProblemPost from '../classes/models/ProblemPost';
  import VueBase from '../classes/vue/VueBase';
  import OnlineJudgeProblem from '../classes/models/OnlineJudgeProblem';
  import Member from '../classes/models/Member';

  @Component
  export default class Home extends VueBase {
    public items: ProblemPost[] = [];
    public page = 1;
    public hasMore = true;
    public me: Member | null = null;

    public async loadItems() {
      const vm = this;
      const resp = await vm.api('problem_post').get({page_size: 10, page: vm.page});
      vm.items.splice(vm.items.length, 0, ...resp.data.results);
      vm.page += 1;
      if (Math.floor((resp.data.count - 1) / 10) + 1 === resp.data.pages) {
        vm.hasMore = false;
      }
    }

    public async viewProblem(problem: OnlineJudgeProblem) {
      window.open(problem.online_judge_url, 'problem_' + problem.id);
    }

    public async deletePost(item: ProblemPost) {
      const vm = this;
      await vm.api('problem_post').delete({id: item.id});
      vm.items.splice(vm.items.indexOf(item), 1);
    }

    private async mounted() {
      const vm = this;
      await vm.loadItems();
      vm.me = await vm.getCurrentUser();
    }
  }
</script>

<style lang="less" scoped>
  @import '../libs/less-template/template-defines';

  .page-header {
    padding: 10px;
    height: 52px;
    border-bottom: 1px solid #F5F5F5;
    overflow: hidden;
    .filtering {
      display: inline-block;
    }
    .actions {
      float: right;
    }
  }

  .page-body {
    ul.post-list {
      font-size: 14px;
      li.post-item {
        .clearfix();
        padding: 20px;
        border-bottom: 1px solid #F5F5F5;
        .post-title {
          font-size: 14px;
          line-height: 26px;
          margin-bottom: 10px;
          button {
            margin-right: 4px;
          }
        }
        .post-excerpt {
          pre {
            font-family: inherit;
          }
        }
        .post-footer {
          margin-top: 20px;
          .clearfix();
          .post-actions {
            float: left;
            button {
              margin-right: 4px;
            }
          }
          .post-status {
            float: right;
            width: 180px;
            .post-author {
              line-height: 24px;
              img.avatar {
                width: 24px;
                height: 24px;
                float: left;
                margin-right: 10px;
              }
              .nickname {
              }
            }
          }
        }
      }
    }
    .block-more {
      text-align: center;
      padding: 30px 0;
    }
  }
</style>
