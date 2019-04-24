import Member from '@/classes/models/Member';

export default class GlobalContext {
  public me: Member | null = null;
  public name = 'Hello!';
}
