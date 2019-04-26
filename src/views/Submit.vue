<template>
  <div class="about">
    <h1>提交版块的计划</h1>
    <br/>
    <p>作为一个ACM训练的聚合网站，怎么能少了提交代码的功能？我们必须能够在这里交题！</p>
    <p>目前盘踞在各大型OJ上的五虎将马甲大家应该早有耳闻目睹吧，这些就是某些网站代为交题的账号。</p>
    <p>不过我们的计划更进一步，可以让用户选择使用平台马甲还是自己提供第三方OJ的账号密码进行提交。</p>
    <p>当然，如果使用后者，当然要基于用户自愿的原则，我们也必须承诺不保存任何用户的登录凭据以及
      获取授权外的第三方账号信息。</p>
    <p>做到这一步，我们就可以将在不同 OJ 平台的账号聚集到这里，在我们这里可以统一提交到所有OJ的入口，
      还可以统一查看所有 OJ 中的进度，是不是很激动！</p>
    <br/>
    <p>我们玩够了吗？当然没有！</p>
    <br/>
    <p>对于所有OJ上面的题目，我们觊觎已久的就是那些题目背后的 TestCase，不掌握 TestCase，就不能算一个真正的题库。</p>
    <p>所以，ACTIPS 也要有自己判题的能力，TestCase，就由用户自己提交！</p>
    <p>我们先不讨论 TestCase 来源的问题，在这里，主要是我们要有一个判题引擎。</p>
    <p>做到这一步，用户在 ACTIPS 每提交一道题，就会有两个结果，
      一个是 ACTIPS 的判题结果，第二个是第三方OJ返回的判题结果。</p>
    <p>有了这个基础，我们就可以有一个神机制把我们想要的 TestCase 做出来：那就是
      <router-link :to="{name:'challenge'}">“挑战机制”</router-link>！</p>
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
</style>
