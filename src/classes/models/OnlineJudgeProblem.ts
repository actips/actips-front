export default class OnlineJudgeProblem {
  public id?: number;
  public site?: number;
  public site_code: string = '';
  public num: string = '';
  public title: string = '';
  public content: string = '';
  public online_judge_url: string = '';

  constructor(data: { [key: string]: any }) {
    Object.assign(this, data);
  }
}
