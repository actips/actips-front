import OnlineJudgeProblem from '@/classes/models/OnlineJudgeProblem';
import ProblemCategory from '@/classes/models/ProblemCategory';

export default class Comment {
  public id = 0;
  public parent = 0;
  public content = '';
  public object_id = 0;
  public content_type = 0;
  public author_nickname = '';
  public parent_nickname = '';
  public date_created = '';

  constructor(data: { [key: string]: any } = {}) {
    Object.assign(this, data);
  }
}
