export default class ApiOptions {
  public method: string = 'GET';
  public params: {} = {};
  public query: { [key: string]: string } = {};
  public data: { [key: string]: any } | FormData = {};

  constructor(method = 'GET', params = {}, query = {}, data = {}) {
    this.method = method;
    this.params = params;
    this.query = query;
    this.data = data;
  }
}
