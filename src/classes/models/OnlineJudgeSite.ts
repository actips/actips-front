export default class OnlineJudgeSite {
  public id?: number;
  public name?: string;
  public homepage?: string;
  public problem_url_template?: string;
  public problem_title_regex?: string;

  constructor(data: { [key: string]: any }) {
    Object.assign(this, data);
  }
}
