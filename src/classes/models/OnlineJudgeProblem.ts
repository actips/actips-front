export default class OnlineJudgeProblem {
  public id = 0;
  public site = 0;
  public site_code = '';
  public num = '';
  public title = '';
  public content = '';
  public online_judge_url = '';

  public time_limit = 0;
  public memory_limit = 0;
  public is_special_judge = false;
  public is_synced = false;
  public description = '';
  public extra_description = '';
  public input_specification = '';
  public output_specification = '';
  public input_samples = [];
  public output_samples = [];
  public extra_info = {};
  public supported_languages = [];
  public submission_count = 0;
  public submission_count_self = 0;
  public submission_count_self_accepted = 0;

  constructor(data: { [key: string]: any } = {}) {
    data.input_samples = data.input_samples && data.input_samples.split('<!--DATA-SEPARATOR-->') || [];
    data.output_samples = data.output_samples && data.output_samples.split('<!--DATA-SEPARATOR-->') || [];
    data.extra_info = data.extra_info && JSON.parse(data.extra_info) || {};
    Object.assign(this, data);
  }
}
