import {
  NetworkRequester,
  iNetworkRequester,
  iNetworkResponse,
  NetworkProps,
  RequestParams,
  RequestOptions,
} from '@wh/network-define';
import Axios, {
  AxiosInstance,
  AxiosRequestConfig,
  CancelTokenSource,
  Method,
} from 'axios';

export class AxiosRequest
  extends NetworkRequester
  implements iNetworkRequester
{
  instance: AxiosInstance;
  cancels: { [key: string]: Function } = {};

  constructor(options: NetworkProps) {
    super(options);
    this.instance = Axios.create({});
  }

  async get(url: string, options: RequestOptions): Promise<any> {
    return this.send({
      ...options,
      method: 'get',
      url,
    });
  }

  async post(url: string, options: RequestOptions): Promise<any> {
    return this.send({
      ...options,
      method: 'post',
      url,
    });
  }

  put(url: string, options: RequestOptions): Promise<any> {
    return this.send({
      ...options,
      method: 'put',
      url,
    });
  }

  delete(url: string, options: RequestOptions): Promise<any> {
    return this.send({
      ...options,
      method: 'delete',
      url,
    });
  }

  patch(url: string, options: RequestOptions): Promise<any> {
    return this.send({
      ...options,
      method: 'patch',
      url,
    });
  }

  async send(options: RequestOptions): Promise<any> {
    const { id, url, method = 'get', params, body, path, cancel } = options;
    if (!url) {
      return {
        success: false,
        message: 'Network Request: url can not be undefined!',
      };
    }

    const requestParams: AxiosRequestConfig = {
      url,
      method: method as Method,
    };

    if (id) {
      requestParams.cancelToken = new Axios.CancelToken((cancelFunction) => {
        this.cancels[id] = cancelFunction;
        if (cancel && typeof cancel === 'function') cancel(cancelFunction, id);
      });
    }

    if (path) {
      requestParams.url = this.transformPathParams(url, path);
    }

    switch (method.toLowerCase()) {
      case 'get':
        if (params) {
          requestParams.params = params;
        }
        break;
      case 'post':
      case 'put':
        if (body) {
          requestParams.data = body;
        }
        break;
      case 'delete':
        break;
    }

    return await this.instance.request(requestParams);
  }

  cancel(requestId: string): any {
    const cancelFunc = this.cancels[requestId];
    if (cancelFunc) cancelFunc();
  }
}
