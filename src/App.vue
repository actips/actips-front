<template>
  <div id="app">
    <site-header/>
    <router-view/>
  </div>
</template>

<script lang="ts">
  import Vue from 'vue';
  import {Component} from 'vue-property-decorator';
  import SiteHeader from '@/components/SiteHeader.vue';

  @Component({components: {SiteHeader}})
  export default class App extends Vue {
  }
</script>
