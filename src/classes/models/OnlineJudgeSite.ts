export default class OnlineJudgeSite {
  public id = 0;
  public name = 0;
  public code = '';
  public homepage = '';
  // public problem_url_template = '';
  // public problem_title_regex='';

  constructor(data: { [key: string]: any }) {
    Object.assign(this, data);
  }
}
