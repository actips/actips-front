export default class OnlineJudgeProblem {
  public id?: number;
  public site?: number;
  public num: string = '';
  public title: string = '';
  public content: string = '';

  constructor(data: { [key: string]: any }) {
    Object.assign(this, data);
  }
}
