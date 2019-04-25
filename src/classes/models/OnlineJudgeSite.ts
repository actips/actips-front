export default class OnlineJudgeSite {
  public id?: number;
  public name?: string;
  public homepage?: string;
  public problem_url_template?: string;

  constructor(data: { [key: string]: any }) {
    Object.assign(this, data);
  }
}
