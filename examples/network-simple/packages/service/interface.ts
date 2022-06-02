import BaseRequest from "../request/base";
import { Method } from "../manager/method";
import { Feature } from "../feature/interface";

/**
 * 注入接口
 */
export declare interface InjectInterface {
  services: Array<ServiceInterface>;
}

/**
 * 服务接口对象
 */
export declare interface ServiceInterface {
  /**
   * 请求id
   */
  id?: string
  /**
   * 服务名
   */
  name?: string;
  /**
   * 服务url
   */
  url: string;
  /**
   * 服务标签
   */
  tag?: Array<string> | string;
  /**
   * 服务类型
   */
  method: Method | string;
  /**
   * 默认参数
   */
  defaultParams?: object;
  /**
   * 特性
   */
  feature?: Array<Feature | string> | Feature | string;
  /**
   * 请求前的勾子
   */
  beforeRequest?: Function;
  /**
   * 请求返回后的勾子
   */
  afterResponse?: Function;
  /**
   * 取消函数
   */
  cancel?: Function
}
