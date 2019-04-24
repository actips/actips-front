import 'reset-css';
import '@/assets/css/style.less';

import Vue from 'vue';
import App from './App.vue';
import router from './router';
import VueRoot from '@/classes/vue/VueRoot';
import '@/classes/vue/VueMixin';

Vue.config.productionTip = false;

(window as any).app = new VueRoot({
  router,
  render: (h) => h(App),
}).$mount('#app');
