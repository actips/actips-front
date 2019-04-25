export default class Member {
  public user?: number;
  public gender?: string;
  public nickname?: string;
  public avatarUrl?: string;

  constructor(data: { [key: string]: any }) {
    Object.assign(this, data);
  }
}
