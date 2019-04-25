export default class ProblemCategory {
  public id?: number;
  public name?: string;
  public parent?: number;
  public children: ProblemCategory[] = [];

  constructor(data: { [key: string]: any }) {
    Object.assign(this, data);
  }
}
