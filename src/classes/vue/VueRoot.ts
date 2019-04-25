import Vue from 'vue';
import GlobalContext from '@/classes/utils/GlobalContext';

export default class VueRoot extends Vue {
  public globalContext: GlobalContext = new GlobalContext();
}

