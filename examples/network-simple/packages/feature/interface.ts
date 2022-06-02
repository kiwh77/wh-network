import { RequestManager } from '../manager';
import { RequestParams } from '../manager/interface';
import Response from '../manager/response';
import { ServiceInterface } from '../service/interface';

/**
 * 请求插件
 */
export interface PluginInterface {
  // 插件名称
  name: string;
  /**
   * 处理函数
   * @param manager 请求管理类
   * @param service 当前处理接口对象
   * @param params 数据
   */
  beforeRequest?(
    manager: RequestManager,
    service: ServiceInterface,
    params: RequestParams,
    action?: object
  ): RequestParams;
  /**
   * 请求结束后处理
   * @param manager 请求管理类
   * @param service 当前处理接口对象
   * @param response 返回的数据
   */
  afterResponse?(
    manager: RequestManager,
    service: ServiceInterface,
    response: Response,
    action?: object
  ): Response;
}

export enum Feature {
  useToken = 'useToken',
  isArrayBody = 'isArrayBody',
  isDownload = 'isDownload',
  isUpload = 'isUpload',
}
