import axios, {AxiosInstance, AxiosResponse} from 'axios';
import urljoin from 'url-join';
import template from 'url-template';
import Config from '@/classes/utils/Config';
import Vue from 'vue';
import ApiOptions from '@/classes/utils/ApiOptions';

// All http methods: https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods
const httpMethodsSafe = ['get', 'head', 'connect', 'options', 'trace'];
const httpMethodsUnsafe = ['post', 'put', 'delete', 'patch'];
const httpMethodsParseBody: { [key: string]: boolean } = {
  get: false,
  head: false,
  connect: false,
  options: false,
  trace: false,
  post: true,
  put: true,
  delete: false,
  patch: true,
};
const httpMethods = [...httpMethodsSafe, ...httpMethodsUnsafe];

export default class ApiResource {
  public vm: Vue;
  public axios: AxiosInstance;
  public model: string;
  public root: string;
  public template: any; // Template

  constructor(model: string, apiRoot: string = '', apiFormat: string = '', vm: any) {
    const resource = this;
    const config: Config = vm.ctx.config;
    this.model = model;
    this.root = apiRoot || config.apiRoot;
    this.template = template.parse(apiFormat || config.apiFormat);

    // const _this = this;
    // 动态生成实例，使得动态配置 config.axios_options 修改可以动态生效
    this.vm = vm;
    this.axios = axios.create(config.axiosOptions);
    // httpMethods.forEach(method => {
    //   this[method] = async function () {
    //     console.log(method, arguments)
    // return _this.request(method.toUpperCase(), ...arguments);
    // };
    // });

    // 自动错误处理器
    resource.axios.interceptors.response.use((response) => {
      resource.notifyResponseMessage(response);
      return response;
    }, (error) => {
      resource.notifyResponseMessage(error.response);
      return Promise.reject(error);
    });
  }

  public notifyResponseMessage(response: AxiosResponse) {
    const resource = this;
    if (response.data.msg) {
      if (response.data.silent) {
        return;
      }
      resource.vm.$Message[response.data.ok ? 'success' : 'warning'](response.data.msg);
    } else if (response.status >= 400) {
      resource.vm.$Message.error(JSON.stringify(response.data));
    }
  }


  public get(...args: any[]) {
    return this.request('GET', ...args);
  }

  public post(...args: any[]) {
    return this.request('POST', ...args);
  }

  public put(...args: any[]) {
    return this.request('PUT', ...args);
  }

  public patch(...args: any[]) {
    return this.request('PATCH', ...args);
  }

  public delete(...args: any[]) {
    return this.request('DELETE', ...args);
  }

  public async request(method = 'GET', ...args: any[]) {
    const {params, data, query} = this.parseArgs(method, args);
    // TODO: 后期可以考虑插入钩子
    // data = await config.hooks.filter_data_before_api_request.apply(this.vm, [data]);
    return this.axios.request({
      method,
      url: urljoin(this.root, this.model, this.template.expand(params)),
      params: query,
      data,
    });
  }

  /**
   * 从 vue-resource 迁移，当 Resource 方法调用 http 方法的时候，传入参数的归一化
   * 调用的 http 方法
   * @param method
   * @param args 传入的参数数组，即 api(model).get(...args) 或者 api(model).post(...args) 的参数数组
   * @returns {{method: *, params: {}, query: {}}}
   */
  private parseArgs(method: string, args: any[]) {
    if (httpMethods.indexOf(method.toLowerCase()) === -1) {
      throw new Error('不支持的 http 方法：' + method);
    }
    const hasBody = httpMethodsParseBody[method.toLowerCase()];
    const options = new ApiOptions(method);
    switch (args.length) {
      case 3:
        if (hasBody) {
          options.params = args[0];
          options.data = args[1];
          options.query = args[2];
        } else {
          throw new Error('最多2个参数 [params, query], 但是传入了' + args.length + '个');
        }
        break;
      case 2:
        if (hasBody) {
          options.params = args[0];
          options.data = args[1];
        } else {
          options.params = args[0];
          options.query = args[1];
        }
        break;
      case 1:
        if (hasBody) {
          options.data = args[0];
        } else {
          options.params = args[0];
        }
        break;
      case 0:
        break;
      default:
        throw new Error('最多3个参数 [params, data, query], 但是传入了' + args.length + '个');
    }
    return options;
  }
}

