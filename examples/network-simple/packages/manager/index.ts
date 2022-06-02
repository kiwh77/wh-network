import BaseRequest from '../request/base';
import GetRequest from '../request/get';
import PostRequest from '../request/post';
import PutRequest from '../request/put';
import DeleteRequest from '../request/delete';
import PatchRequest from '../request/patch';
import { RequestEvents } from '../request/event';
import Response from './response';
import Features from '../feature';
import { Method } from './method';
import { ServiceInterface } from '../service/interface';
import { RequestParams, InitManagerOptions } from './interface';
import { PluginInterface } from '../feature/interface';
import Axios, { Canceler } from 'axios';
import MD5 from 'blueimp-md5';
import { cloneLoop } from '@jsmini/clone';

export class RequestManager {
  /**
   * 回调
   */
  callback: (event: RequestEvents, data: any) => {};
  /**
   * 事件存储
   */
  events: { [key: string]: Array<Function> } = {};
  /**
   * 请求处理类
   */
  requests: { [key: string]: BaseRequest } = {};
  /**
   * 接口存储
   */
  services: Array<ServiceInterface>;
  /**
   * 自定义插件
   */
  plugins: Array<PluginInterface> = [...Features];
  /**
   * 当前请求池
   */
  bucket: Array<ServiceInterface> = [];

  /**
   * 拦截器
   */
  interceptors: { [key: string]: Function } = {
    responseFulfilled: this.responseFulfilled.bind(this),
    responseRejected: this.responseRejected.bind(this),
    requestFulfilled: this.requestFulfilled.bind(this),
    requestRejected: this.requestRejected.bind(this),
  };
  /**
   * 数据仓库
   */
  store: { [key: string]: any } = {};

  // 业务查询成功、失败判断
  fulfillJudge: Function;
  rejectJudge: Function;

  constructor(options: InitManagerOptions = {}) {
    this.initRequests();

    const { callback, fulfillJudge, rejectJudge, services } = options;
    if (callback) this.callback = callback;
    if (fulfillJudge) this.fulfillJudge = fulfillJudge;
    if (rejectJudge) this.rejectJudge = rejectJudge;
    if (services) this.services = services;
  }

  /**
   * 注册事件
   * @param event 事件名称
   * @param handler 事件处理函数
   */
  public registerEvent(event: RequestEvents, handler: Function) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(handler);
  }

  /**
   * 注销事件
   * @param event 事件名称
   */
  public unregisterEvent(event: RequestEvents) {
    this.events[event] = undefined;
  }

  /**
   * 注册请求处理器，如属于已有的，将会替换
   * @param method 请求方法
   * @param request 请求处理器实例
   */
  public useRequest(method: string, request: BaseRequest) {
    this.requests[method] = request;
  }

  public cancelRequest(method: string) {
    delete this.requests[method];
    if (
      Method.GET === method ||
      Method.POST === method ||
      Method.PUT === method ||
      Method.DELETE === method ||
      Method.PATCH === method
    ) {
      this.initRequests(method);
    }
  }

  /**
   * 初始化请求处理器
   * @param method 初始化指定处理器
   */
  private initRequests(method?: string) {
    const methods = method
      ? [method]
      : [Method.GET, Method.POST, Method.PUT, Method.DELETE, Method.PATCH];
    methods.forEach((m) => {
      switch (m) {
        case Method.GET:
          const get = new GetRequest(this.interceptors);
          this.requests[m] = get;
          break;
        case Method.POST:
          const post = new PostRequest(this.interceptors);
          this.requests[m] = post;
          break;
        case Method.PUT:
          const put = new PutRequest(this.interceptors);
          this.requests[m] = put;
          break;
        case Method.DELETE:
          const deleteRequest = new DeleteRequest(this.interceptors);
          this.requests[m] = deleteRequest;
          break;
        case Method.PATCH:
          const patch = new PatchRequest(this.interceptors);
          this.requests[m] = patch;
          break;
      }
    });
  }

  /**
   * 注册数据仓库，供请求或插件使用
   */
  public useStore(obj) {
    this.store = { ...this.store, ...obj };
  }

  /**
   * 注册中间件
   */
  public usePlugin(plugin: PluginInterface) {
    if (!plugin.name) throw new Error('usePlugin 插件不符合规范');
    const index = this.plugins.findIndex((p) => p.name === plugin.name);
    if (index > -1) {
      this.plugins[index] = plugin;
    } else {
      this.plugins.push(plugin);
    }
  }

  /**
   * 转化为Vuex的action
   * @param tag 对应标签
   */
  public action2Vuex(tag) {
    const tags = Array.isArray(tag) ? tag : [tag];
    return this.services.reduce((total, service) => {
      if (!service.tag || !service.name) return;
      if (
        (typeof service.tag === 'string' && tags.includes(service.tag)) ||
        (Array.isArray(service.tag) &&
          service.tag.some((t) => tags.includes(t)))
      ) {
        total[service.name] = async (action, payload) => {
          return await this.send(service, payload, action);
        };
      }
      return total;
    }, {});
  }

  /**
   * 添加接口请求
   * @param service
   */
  public appendService(service: Array<ServiceInterface> | ServiceInterface) {
    let services;
    if (toString.apply(service) === '[object Array]') {
      services = service;
    } else if (toString.apply(service) === '[object Object]') {
      services.push(service);
    }
    this.services = [
      ...this.services,
      ...services.filter((service) => service.name),
    ];
  }

  /**
   * 发射事件
   * @param event 事件名称
   * @param params 相关参数
   */
  private emit(event: RequestEvents, params: any) {
    const funcs = this.events[event];
    if (funcs && funcs.length > 0 && Array.isArray(funcs)) {
      funcs.forEach((func) => func(params));
    }
  }

  /**
   * 调用已保存的接口
   */
  public async dispatch(name: string, params: RequestParams) {
    let service = this.services.find((item) => item.name === name);
    if (!service) throw new Error(`${name}未申请`);
    return await this.send(service, params);
  }
  /**
   * 发送参数
   * @param service 接口服务对象
   * @param params 发送参数
   */
  public async send(
    service: ServiceInterface,
    params: RequestParams = {},
    action?: object
  ) {
    const request = this.requests[(service.method || Method.GET).toLowerCase()];
    if (!request) throw new Error(`未找到${service.method}对应请求处理器`);
    if (!service.url) throw new Error(`接口url未设置`);

    const reqService = cloneLoop(service);
    // 去重操作
    const requestId = MD5(
      JSON.stringify([
        service.method.toLowerCase(),
        service.url,
        JSON.stringify(params.params),
        JSON.stringify(params.query),
        JSON.stringify(params.path),
      ])
    );

    if (this.bucket.some((item) => item.id === requestId)) return;
    reqService.id = requestId;

    let reqParams: RequestParams = cloneLoop(params);
    if (!reqParams.config) reqParams.config = {};

    let serviceFeatures = [];

    // 插件调用
    if (typeof service.feature === 'string') {
      serviceFeatures.push(service.feature);
    } else if (toString.apply(service.feature) === '[object Array]') {
      serviceFeatures = service.feature;
    }

    serviceFeatures = serviceFeatures.map((item) => {
      let featureHandler = this.plugins.find((f) => f.name === item);
      if (!featureHandler) return;
      if (typeof featureHandler.beforeRequest === 'function') {
        reqParams =
          featureHandler.beforeRequest(this, service, reqParams, action) ||
          reqParams;
      }
      return featureHandler;
    });

    // 请求发起前
    if (typeof service.beforeRequest === 'function') {
      reqParams =
        service.beforeRequest(reqParams, service, action) || reqParams;
    }

    // 取消请求
    reqParams.config.cancelToken = new Axios.CancelToken((c: Canceler) => {
      if (typeof reqParams.cancel === 'function') reqParams.cancel(c);
      reqService.cancel = c;
    });

    this.bucket.push(reqService);
    // 发起请求
    let response = await request.send(reqParams, reqService);

    // 请求完成，清理记录
    const index = this.bucket.findIndex((item) => item.id === reqService.id);
    this.bucket.splice(index, 1);

    // 请求返回后
    if (typeof service.afterResponse === 'function') {
      response =
        (await service.afterResponse(response, service, reqParams, action)) ||
        response;
    }

    // 请求返回后插件调用
    serviceFeatures.forEach(async (item) => {
      if (typeof item.afterResponse === 'function') {
        response =
          (await item.afterResponse(this, service, response, action)) ||
          response;
      }
    });

    return response;
  }

  /**
   * 取消请求
   * @param id 请求id
   */
  cancel(id) {
    const service = this.bucket.find((item) => item.id === id);
    if (service && service.cancel) {
      service.cancel();
    }
  }

  /**
   * 请求成功
   * @param response 响应数据
   */
  private responseFulfilled(response) {
    const { status, statusText, data = {}, service } = response;
    let result = new Response(data);
    if (this.fulfillJudge) {
      result = this.fulfillJudge(result, response);
    } else if (status !== 200) {
      result.success = false;
      result.msg = statusText;
    } else if (Math.floor(data.code) !== 200) {
      result.success = false;
    }
    // 回调事件
    this.callback &&
      this.callback(
        result.success
          ? RequestEvents.onRespondSuccess
          : RequestEvents.onRespondFail,
        {
          response,
          result,
          service,
        }
      );
    this.emit(
      result.success
        ? RequestEvents.onRespondSuccess
        : RequestEvents.onRespondFail,
      {
        response,
        result,
        service,
      }
    );
    return result;
  }

  /**
   * 请求失败
   * @param error 失败数据
   */
  private responseRejected(error) {
    let result = new Response({
      success: false,
      msg: error.message,
    });
    const { response } = error;
    if (response) {
      if (this.rejectJudge) {
        result = this.rejectJudge(result, response);
      } else if (response.status === 403) {
        result.success = false;
        result.msg = response.data.msg;
      } else if (response.success !== 200) {
        result.success = false;
        result.data = response.data;
      }
    }
    // 回调事件
    this.callback &&
      this.callback(RequestEvents.onRespondFail, {
        error,
        response,
        result,
      });
    this.emit(RequestEvents.onRespondFail, {
      response,
      result,
    });
    return result;
  }

  /**
   * 发起请求前处理请求数据
   * @param params 请求数据
   */
  private requestFulfilled(params) {
    this.callback && this.callback(RequestEvents.onRequestSuccess, params);
    this.emit(RequestEvents.onRequestSuccess, params);
    return params;
  }

  /**
   * 发起请求前处理请求数据失败
   * @param error 失败数据
   */
  private requestRejected(error) {
    this.callback && this.callback(RequestEvents.onRequestFail, error);
    // 设置请求前处理失败逻辑
    this.emit(RequestEvents.onRequestFail, error);
    return error;
  }

  install(Vue) {
    if (Vue) {
      Vue.prototype.$http = this;
    }
  }
}
