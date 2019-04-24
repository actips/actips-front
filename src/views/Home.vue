<template>
  <div>
    {{hello}}
    {{ctx.name}}
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';

  @Component({
    data() {
      return {hello: 'you'};
    },
  })
  export default class Home extends Vue {
  }
</script>
