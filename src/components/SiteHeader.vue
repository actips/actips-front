<template>
  <div class="site-header">
    <div class="wrapper">
      <div class="logo">
        <pre>
 ______     ______     ______   __     ______   ______
/\  __ \   /\  ___\   /\__  _\ /\ \   /\  == \ /\  ___\
\ \  __ \  \ \ \____  \/_/\ \/ \ \ \  \ \  _-/ \ \___  \
 \ \_\ \_\  \ \_____\    \ \_\  \ \_\  \ \_\    \/\_____\
  \/_/\/_/   \/_____/     \/_/   \/_/   \/_/     \/_____/
        </pre>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator';

  @Component
  export default class SiteHeader extends Vue {
    // @Prop() private msg!: string;
  }
</script>

<style lang="less" scoped>
  .site-header {
    .wrapper {
      width: 1280px;
      margin: 0 auto;
    }
    .logo {
      font-family: monospace;
      font-size: 12px;
    }
  }
</style>
