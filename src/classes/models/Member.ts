export default class Member {
  public user?: number;
  public gender?: string;
  public nickname?: string;
  public avatar_url?: string;

  constructor(data: { [key: string]: any }) {
    Object.assign(this, data);
  }
}
