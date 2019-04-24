import Vue from 'vue';
import GlobalContext from '@/classes/GlobalContext';

export default class VueRoot extends Vue {
  public globalContext = new GlobalContext();
}

