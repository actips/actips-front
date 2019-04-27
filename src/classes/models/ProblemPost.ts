import OnlineJudgeProblem from '@/classes/models/OnlineJudgeProblem';
import ProblemCategory from '@/classes/models/ProblemCategory';

export default class ProblemPost {
  public id = 0;
  public author = 0;
  public date_created = '';
  public date_updated = '';
  public title = '';
  public content = '';
  public problems: number[] = [];
  public problems_item: OnlineJudgeProblem[] = [];
  public categories: number[] = [];
  public categories_item: ProblemCategory[] = [];

  constructor(data: { [key: string]: any }) {
    Object.assign(this, data);
  }
}
