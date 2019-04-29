import OnlineJudgeProblem from '@/classes/models/OnlineJudgeProblem';
import ProblemCategory from '@/classes/models/ProblemCategory';

export default class ProblemPost {
  public id = 0;
  public author = 0;
  public title = '';
  public content = '';
  public origin_link: string | null = '';
  public problem = 0;
  public problem_num = '';
  public problem_title = '';
  public problem_url = '';
  public problem_site_code = '';
  public problems_related: number[] = [];
  public problems_related_item: OnlineJudgeProblem[] = [];
  public categories: number[] = [];
  public categories_item: ProblemCategory[] = [];
  public rating_difficulty = 0;
  public date_created = '';
  public date_updated = '';

  constructor(data: { [key: string]: any } = {}) {
    Object.assign(this, data);
  }
}
