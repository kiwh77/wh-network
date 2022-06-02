import {
  iNetworkPlugin,
  isNetworkPlugin,
  NetworkRequester,
  iNetworkRequester,
  NetworkService,
  RequestParams,
  NetworkProps,
  transformService,
  isArray,
  isObject,
  isString,
} from '@wh/network-define';
import { cloneLoop } from '@jsmini/clone';
import { nanoid } from 'nanoid';

import { NetworkEvent, NetworkLifeEvent } from './event';
import { NetworkPlugin, PluginExecMode } from './plugin';
import { NetworkBucket } from './bucket';

/**
 * 网络请求核心调度组件
 */
export class Network {
  // 是请允许重复请求
  readonly allowRepeatedRequests: Boolean;

  readonly plugins: Array<iNetworkPlugin> = [];
  readonly services: Array<NetworkService> = [];
  private requester?: iNetworkRequester;

  private event: NetworkEvent = new NetworkEvent();
  private bucket: NetworkBucket = new NetworkBucket();
  private plugin: NetworkPlugin = new NetworkPlugin();

  constructor(options?: NetworkProps) {
    const {
      plugins = [],
      allowRepeatedRequests = false,
      services = [],
      events = {},
    } = options || {};

    this.allowRepeatedRequests = allowRepeatedRequests;
    plugins.forEach(this.plugin.push);

    this.services = services.reduce((total: Array<NetworkService>, service) => {
      const result = transformService(service);
      if (!result) return total;
      total.push(result as NetworkService);
      return total;
    }, []) as Array<NetworkService>;

    Object.keys(events).forEach((event: string) => {
      this.event.on(event, events[event]);
    });

    // TODO：根据已有配置初始化send方法插件管道
    // TODO：把去重、生命周期等抽象成插件，根据配置进行调用方法生成
  }

  /**
   * 使用插件或核心组件
   */
  use(plugin: any) {
    if (isNetworkPlugin(plugin)) {
      this.plugins.push(plugin);
    } else if ((plugin.constructor = NetworkRequester)) {
      this.requester = new plugin({});
    }
  }

  /**
   * 快速发起get请求
   * @param url
   * @param options
   */
  get(url: string, options: RequestParams) {
    return this.send({
      ...options,
      method: 'get',
      url,
    });
  }
  post(url: string, options: RequestParams) {
    return this.send({
      ...options,
      method: 'post',
      url,
    });
  }
  put(url: string, options: RequestParams) {
    return this.send({
      ...options,
      method: 'put',
      url,
    });
  }
  delete(url: string, options: RequestParams) {
    return this.send({
      ...options,
      method: 'delete',
      url,
    });
  }
  patch(url: string, options: RequestParams) {
    return this.send({
      ...options,
      method: 'patch',
      url,
    });
  }

  /**
   * 根据定义好的请求名发起请求
   */
  async send(
    options?: RequestParams & Pick<NetworkService, 'name'>
  ): Promise<any> {
    if (!this.requester) throw new Error(`Network: requester undefined`);

    const { name, cancel } = options || {};
    let service;
    if (name && isString(name)) {
      service = cloneLoop(this.services.find((item) => item.name === name));
    }

    if (!options?.url || !service?.url) {
      throw new Error(
        `Network: service ${service ? name + "'s " : ''}url undefined!`
      );
    }

    options.id = nanoid();

    // 去重判断
    if (this.allowRepeatedRequests && !this.bucket.verify(options)) {
      this.event.emit(NetworkLifeEvent.RequestRejected, {
        type: 'RepeatedRequest',
        options,
      });
      return;
    }

    // 插件使用
    let features: string[] = [];
    if (isString(options.feature)) {
      features = [options.feature as string];
    } else if (isArray(options.feature)) {
      features = options.feature as string[];
    }
    options = this.plugin.exec(
      features,
      PluginExecMode.before,
      this,
      options,
      service
    );

    // 生命周期
    this.event.emit(NetworkLifeEvent.RequestFulfilled, options);
    // 取消请求句柄
    // 发起请求
    let response = await this.requester.send(options!);
    // 插件使用
    response = this.plugin.exec(
      features,
      PluginExecMode.after,
      this,
      response,
      service
    );

    // 结果处理
    this.event.emit(NetworkLifeEvent.ResponseFulfilled, response);

    return response;
  }

  /**
   * 取消请求
   */
  cancel(id: string) {
    this?.requester?.cancel(id);
  }

  /**
   * Vue2注入
   * @param Vue Vue
   */
  install(Vue: any, options: { alias?: string }) {
    if (Vue) {
      const { alias = '$http' } = options || {};
      Vue.prototype[alias] = this;
    }
  }
}

export function install(Vue: any, options?: NetworkProps) {
  if (Vue) {
    const { alias = '$http', ...otherOptions } = options || {};
    Vue.prototype[alias] = new Network(otherOptions);
  }
}
