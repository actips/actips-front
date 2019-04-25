import Member from '@/classes/models/Member';
import Config from '@/classes/utils/Config';
import config from '@/config';

export default class GlobalContext {
  public me: Member | null = null;
  public config: Config = new Config(config);
}
