import 'reset-css';
import 'highlight.js/styles/github.css';
import 'iview/dist/styles/iview.css';
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
import '@/assets/css/style.less';
import 'font-awesome/css/font-awesome.css';

import Vue from 'vue';
import iView from 'iview';
import VueQuillEditor from 'vue-quill-editor';

import App from './App.vue';
import router from './router';
import VueRoot from '@/classes/vue/VueRoot';

Vue.use(iView);
Vue.use(VueQuillEditor);

Vue.config.productionTip = false;

(window as any).app = new VueRoot({
  router,
  render: (h) => h(App),
}).$mount('#app');
