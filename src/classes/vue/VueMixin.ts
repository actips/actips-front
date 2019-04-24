import GlobalContext from '@/classes/GlobalContext';
import {GlobalMixin} from 'vue-typed';

@GlobalMixin()
class Global {
  get ctx(): GlobalContext {
    return ((this as any).$root as any).globalContext || (window as any).app.globalContext;
  }
}

