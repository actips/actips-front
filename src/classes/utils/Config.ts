import {AxiosRequestConfig} from 'axios';

export default class Config {
  public version: string = '';
  public wxApiRoot: string = '';
  public wxAppId = '';
  public apiRoot = '';
  public apiFormat = '{/id}{/action}/';
  public axiosOptions?: AxiosRequestConfig;

  constructor(config: object) {
    Object.assign(this, config);
  }
}
