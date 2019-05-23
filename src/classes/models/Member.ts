export default class Member {
  public user = 0;
  public username = '';
  public gender = '';
  public nickname = '';
  public avatar_url?: string;
  public mobile = '';
  public email = '';
  public birthday = '';

  constructor(data: { [key: string]: any } = {}) {
    Object.assign(this, data);
  }
}
