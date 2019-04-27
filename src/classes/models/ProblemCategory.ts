export default class ProblemCategory {
  public id = 0;
  public name = '';
  public parent = 0;
  public children: ProblemCategory[] = [];
  public post_count = 0;

  constructor(data: { [key: string]: any }) {
    Object.assign(this, data);
  }
}
