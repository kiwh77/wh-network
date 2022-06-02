import { responseEncoding } from './common';
import { iNetworkPlugin } from './plugin';
import {
  NetworkService,
  NetworkServiceAdvance,
  NetworkServiceBase,
} from './service';

/**
 * 认证参数
 */
export interface BasicCredentials {
  username: string;
  password: string;
}

/**
 * 代理参数
 */
export interface ProxyConfig {
  host: string;
  port: number;
  auth?: {
    username: string;
    password: string;
  };
  protocol?: string;
}

/**
 * 初始化请求类参数
 */
export interface NetworkProps {
  /**
   * 挂载别名
   */
  alias?: string;
  /**
   * 是否允许重复请求
   */
  allowRepeatedRequests?: Boolean;
  /**
   * 服务配置列表
   */
  services?: Array<NetworkService | Array<string | NetworkServiceAdvance>>;
  /**
   * 插件列表
   */
  plugins?: Array<iNetworkPlugin>;
  /**
   * 事件监听
   */
  events?: { [key: string]: Function };
}

/**
 * 请求配置
 */
export interface RequestConfig {
  baseURL?: string;
  headers?: Record<string, string | number | boolean>;
  paramsSerializer?: (params: any) => string;
  timeout?: number;
  timeoutErrorMessage?: string;
  withCredentials?: boolean;
  auth?: BasicCredentials;
  responseType?: ResponseType;
  responseEncoding?: responseEncoding | string;
  xsrfCookieName?: string;
  xsrfHeaderName?: string;
  onUploadProgress?: (progressEvent: any) => void;
  onDownloadProgress?: (progressEvent: any) => void;
  maxContentLength?: number;
  validateStatus?: ((status: number) => boolean) | null;
  maxBodyLength?: number;
  maxRedirects?: number;
  socketPath?: string | null;
  httpAgent?: any;
  httpsAgent?: any;
  proxy?: ProxyConfig | false;
  // cancelToken?: CancelToken;
  decompress?: boolean;
  // transitional?: TransitionalOptions;
  signal?: AbortSignal;
  insecureHTTPParser?: boolean;
}

/**
 * 请求参数
 */
export type RequestParams = {
  /**
   * 本次请求发起id，唯一id
   */
  id?: string;
  /**
   * 应用插件
   */
  feature?: string | [string];
  /**
   * url后query参数
   * 例：[GET]/api/user/list?pageNo=1&pageSize=10，参数传递应是{ params: { pageNo: 1, pageSize: 10 } }
   */
  params?: { [key: string]: any };
  /**
   * 请求体参数
   * 例：[POST]/api/user，请求体参数使用{ body: { key: value } }
   */
  body?: any;
  /**
   * 路径参数，例：/api/user/:id，传递id参数时，应传递 { path: { id: 'xxx' } }
   */
  path?: { [key: string]: any };
  /**
   * 取消函数
   */
  cancel?: Function;
} & Pick<NetworkServiceAdvance, 'feature' | 'beforeRequest' | 'afterResponse'> &
  Pick<NetworkServiceBase, 'url' | 'method'>;

export type RequestOptions = RequestConfig & RequestParams;

/**
 * 返回数据结构协议
 */
export interface iNetworkResponse {
  success: boolean;
  message: string;
  data?: any;
  originData?: any;
}

/**
 * 返回数据结构
 */
export class NetworkResponse implements iNetworkResponse {
  success: boolean;
  message: string;
  data?: any;
  originData?: any;

  constructor(props: iNetworkResponse) {
    const { success, message, data, originData } = props;
    this.success = success;
    this.message = message;
    this.data = data;
    this.originData = originData;
  }
}

/**
 * 请求处理器协议
 */
export interface iNetworkRequester {
  // 简单请求入口
  get?(url: string, options: RequestOptions): Promise<any>;
  post?(url: string, options: RequestOptions): Promise<any>;
  put?(url: string, options: RequestOptions): Promise<any>;
  delete?(url: string, options: RequestOptions): Promise<any>;
  patch?(url: string, options: RequestOptions): Promise<any>;
  /**
   * 请求发送入口
   */
  send(options: RequestOptions): Promise<any>;

  /**
   * 取消请求
   * @param requestId 请求id
   */
  cancel(requestId: string): any;
}

/**
 * 请求处理类基类
 */
export class NetworkRequester implements iNetworkRequester {
  constructor(props: NetworkProps & RequestConfig) {}

  /**
   * 转换path参数
   * @param url 需要转换的url
   * @param params 参数
   */
  transformPathParams(url: string, path: { [key: string]: any } = {}): string {
    const urlComponents = url.split('/');
    return urlComponents
      .map((component: string) => {
        if (
          new RegExp('^:').test(component) &&
          path[component.replace(':', '')]
        ) {
          return path[component.replace(':', '')];
        }
        return component;
      })
      .join('/');
  }

  /**
   * 拼接query参数
   * @param url 需要拼接的url
   * @param params 参数
   */
  transformQueryParams(
    url: string,
    query: { [key: string]: any } = {}
  ): string {
    const keys = Object.keys(query);
    if (keys.length === 0) {
      return url;
    }
    const queryString = keys.map((key) => `${key}=${query[key]}`).join('&');
    return `${url}?${queryString}`;
  }

  send(options: RequestOptions): Promise<any> {
    throw new Error('Network Request: base request can not use!');
  }

  cancel(requestId: string): Promise<any> {
    throw new Error('Network Request: base request con not use!');
  }
}
