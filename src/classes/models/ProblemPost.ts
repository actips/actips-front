import OnlineJudgeProblem from '@/classes/models/OnlineJudgeProblem';
import ProblemCategory from '@/classes/models/ProblemCategory';

export default class ProblemPost {
  public id?: number;
  public author?: number;
  public date_created?: string;
  public date_updated?: string;
  public title: string = '';
  public excerpt: string = '';
  public content: string = '';
  public problems: number[] = [];
  public problems_item: OnlineJudgeProblem[] = [];
  public categories: number[] = [];
  public categories_item: ProblemCategory[] = [];

  constructor(data: { [key: string]: any }) {
    Object.assign(this, data);
  }
}
