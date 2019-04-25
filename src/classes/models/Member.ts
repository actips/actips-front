export default class Member {
  public user?: number;
  public gender?: string;
  public nickname?: string;
  public avatarUrl?: string;

  constructor(data: { [key: string]: any }) {
    console.log(data);
    Object.assign(this, data);
  }
}
