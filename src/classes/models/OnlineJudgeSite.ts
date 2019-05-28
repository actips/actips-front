export default class OnlineJudgeSite {
  public id = 0;
  public name = 0;
  public code = '';
  public homepage = '';
  // public problem_url_template = '';
  // public problem_title_regex='';

  public supported_features: string[] = [];
  public post_count = 0;
  public problem_count = 0;
  public is_granted = false;
  public is_supported = false;

  constructor(data: { [key: string]: any } = {}) {
    Object.assign(this, data);
  }
}
