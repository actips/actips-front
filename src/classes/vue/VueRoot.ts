import GlobalContext from '@/classes/utils/GlobalContext';
import VueBase from '@/classes/vue/VueBase';

export default class VueRoot extends VueBase {
  public globalContext = new GlobalContext();
}

