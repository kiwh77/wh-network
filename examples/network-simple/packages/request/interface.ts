import { AxiosInstance } from "axios";
import { RequestParams } from "../manager/interface";
import { Method } from "../manager/method";
import { ServiceInterface } from "../service/interface";

/**
 * 拦截器
 */
export declare enum RequestInterceptor {
  responseFulfilled = 'responseFulfilled',
  responseRejected = 'responseRejected',
  requestFulfilled = 'requestFulfilled',
  requestRejected = 'requestRejected',
}

export declare interface RequestInterface {
  method: Method;
  // axios实例
  axios: AxiosInstance;
  /**
   * 发起请求
   */
  send(body: RequestParams, service: ServiceInterface): Promise<any>;
}
