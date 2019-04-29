export default class Member {
  public user = 0;
  public gender = '';
  public nickname = '';
  public avatar_url?: string;

  constructor(data: { [key: string]: any } = {}) {
    Object.assign(this, data);
  }
}
