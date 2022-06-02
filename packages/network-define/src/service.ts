import { Method } from './common';
import { isArray, isObject } from './utils';

/**
 * 接口、服务基本信息
 */
export interface NetworkServiceBase {
  /**
   * 服务名
   */
  name?: string;
  /**
   * 服务url
   */
  url: string;
  /**
   * 服务类型
   */
  method: Method | string;
}

/**
 * 接口、服务进阶信息
 */
export interface NetworkServiceAdvance {
  /**
   * 描述
   */
  description?: string;
  /**
   * 服务标签
   */
  tag?: Array<string> | string;
  /**
   * 默认参数
   */
  defaultParams?: object;
  /**
   * 特性
   */
  feature?: Array<string> | string;
  /**
   * 请求前的勾子
   */
  beforeRequest?: Function;
  /**
   * 请求返回后的勾子
   */
  afterResponse?: Function;
}

export type NetworkService = NetworkServiceBase & NetworkServiceAdvance;

export function isNetworkService(obj: any) {
  return isObject(obj) && 'name' in obj && 'url' in obj && 'method' in obj;
}

/**
 * 接口对象转换函数
 * @param params 需要转换的接口对象
 * @returns NetworkService service对象
 */
export function transformService(
  params: NetworkService | Array<string | NetworkServiceAdvance>
) {
  if (isNetworkService(params)) {
    return params;
  } else if (isArray(params)) {
    const [name, method, url, advance] = params as Array<
      string | NetworkServiceAdvance
    >;
    if (!name || !method || !url) return;
    return isObject(advance)
      ? {
          ...(advance as NetworkServiceAdvance),
          name,
          method,
          url,
        }
      : {
          name,
          url,
          method,
        };
  }
  return;
}
