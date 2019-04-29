export default class OnlineJudgeProblem {
  public id = 0;
  public site = 0;
  public site_code = '';
  public num = '';
  public title = '';
  public content = '';
  public online_judge_url = '';

  constructor(data: { [key: string]: any } = {}) {
    Object.assign(this, data);
  }
}
