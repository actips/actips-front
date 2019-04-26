<template>
  <div class="about">
    <h1>挑战功能计划</h1>
    <p>这是一个激动人心的功能，绝对是！</p>
    <p>玩过 TopCoder 和 Codeforces 上面的 Challenge 吗？我们可以提供很多机会！</p>
    <br/>
    <p>这个功能要放到交题功能全部实现之后，我们现在这几项已经就绪的功能机制：</p>
    <ul>
      <li>用户可以在 ACTIPS 提交代码，然后提交给第三方并且获得判题反馈；</li>
      <li>ACTIPS 有一个可累积增加的 TestCase 集合（有些题有有些题没有）；</li>
      <li>对于 ACTIPS 里面有 TestCase 的题目，用户交题可以获得一个站内的判题结果；</li>
    </ul>
    <p>于是，对于某些题目以及某些提交，如果满足如下条件：</p>
    <ul>
      <li>这道题目已经有一个在第三方 AC 的可运行例程（我们假设这是绝对正确的，
        这样我们可以用来为用户提交的任何输入产生一个正确的输出用于比对）；
      </li>
      <li>某个提交通过了 ACTIPS 的判题，然而没有通过第三方 OJ 的判题。</li>
    </ul>
    <p>这意味着什么？这意味着我们在这一道题上的 TESTCASE 弱于第三方 OJ 的 TESTCASE。</p>
    <p>我们把这类提交标记为“可供挑战"的提交，大家可以在挑战列表中看到这些提交，并且能够查看这些代码，并且发起挑战。</p>
    <p>如果用户B查看了用户A之后发起挑战，并且我们掌握一个用户C提交的在第三方OJ通过的历程；</p>
    <p>用户B需要输入一个 INPUT CASE，以挑战用户A的提交，如果下面结果都满足了，这就是一次成功的挑战：</p>
    <ul>
      <li>这个输入通过了用户C的例程，产生了正常的结果（不发生TLE或者RE之类的情况）；</li>
      <li>这个输入通过用户C的例程产生的结果，与通过挑战的用户A提交的代码例程产生的结果不同，
        又或者把用户A的例程跑成TLE或者RE之类；
      </li>
    </ul>
    <p>用户完成了一次成功的挑战后，我们会执行如下几步：</p>
    <ul>
      <li>将这个 TESTCASE 附加到这道题的 TESTCASE 中。</li>
      <li>使用这个 TESTCASE 重判同一道题所有的“可以挑战”的题目。（即那些通过了 ACTIPS 判题但没有通过 OJ 判题的）</li>
      <li>给成功挑战的用户奖励可观的经验值/声望值。</li>
    </ul>
    <p>这里可能会有一些问题存在，但是貌似并不会对整套机制产生实质的影响：</p>
    <ul>
      <li>SpecialJudge 的题目貌似不能够行得通；</li>
      <li>有些 Challenge 的数据是超出题目要求的数据边界的，这种属于非法输入，但是无监督状态很难自动剔除；</li>
    </ul>
    <br/>
    <p>如果这套机制实现，我们就可以很高效地收集我们站内的 TestCase 了！并且在进行 Challenge 的过程中，
      每个参与者都能够获得非凡的成就感以及技能提升！</p>
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
