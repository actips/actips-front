import 'reset-css';
import 'iview/dist/styles/iview.css';
import '@/assets/css/style.less';

import Vue from 'vue';
import iView from 'iview';

import App from './App.vue';
import router from './router';
import VueRoot from '@/classes/vue/VueRoot';

Vue.use(iView);

Vue.config.productionTip = false;

(window as any).app = new VueRoot({
  router,
  render: (h) => h(App),
}).$mount('#app');
