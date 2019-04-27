<template>
  <div class="question">
    <h1>求助（问答）计划</h1>
    <p>
      这里计划打造成一个类似 StackOverflow 的问答社区，与题解文章不同的在于这里可以发布基于题目的问题，
      而不是直接发布一个解决方案。参照 StackOverflow 的规则，通过回答这些问题，
      或者在问题或者回答上面获得赞同，可以获得声望值。
    </p>
    <p>
      针对OJ社区的一个特殊性，问题提及的题目可以推送给已经通过这道题目的其他用户（类似知乎的邀请回答机制）。
    </p>
  </div>
</template>

<style lang="less" scoped>
  h1 {
    font-size: 24px;
    line-height: 48px;
  }

  a {
    text-decoration: underline;
  }

  p {
    text-indent: 2em;
    font-size: 14px;
    line-height: 24px;
    margin: 8px 0;
  }

  ul {
    font-size: 14px;
    list-style-type: disc;
    margin: 15px 4em;
  }
</style>
