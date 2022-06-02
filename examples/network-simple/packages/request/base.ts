import Axios, { AxiosInstance } from "axios";
import Qs from "qs";
import { Method } from "../manager/method";
import { ServiceInterface } from "../service/interface";
import { RequestInterface } from "./interface";
import { RequestParams } from "../manager/interface";

/**
 * HTTP请求基类，内置默认参数、行为
 */
export default class BaseRequest implements RequestInterface {
  method: Method;

  axios: AxiosInstance = Axios.create({
    timeout: 60000,
    responseType: "json",
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: false,
  });

  constructor(props) {
    const {
      responseFulfilled,
      responseRejected,
      requestFulfilled,
      requestRejected,
    } = props;
    if (requestFulfilled) {
      this.axios.interceptors.request.use(requestFulfilled, requestRejected);
    }
    if (responseFulfilled) {
      this.axios.interceptors.response.use(responseFulfilled, responseRejected);
    }
  }
  // 默认请求配置
  defaultRequestConfig = {
    paramsSerializer: function (params) {
      return Qs.stringify(params, {
        arrayFormat: "brackets",
      });
    },
  };

  /**
   * 转换path参数
   * @param url 需要转换的url
   * @param params 参数
   */
  transformPathParams(url: string, path: object = {}): string {
    const urlComponents = url.split("/");
    return urlComponents
      .map((component: string) => {
        if (
          new RegExp("^:").test(component) &&
          path[component.replace(":", "")]
        ) {
          return path[component.replace(":", "")];
        }
        return component;
      })
      .join("/");
  }

  /**
   * 拼接query参数
   * @param url 需要拼接的url
   * @param params 参数
   */
  transformQueryParams(url: string, query: object = {}): string {
    const keys = Object.keys(query);
    if (keys.length === 0) {
      return url;
    }
    const queryString = keys.map((key) => `${key}=${query[key]}`).join("&");
    return `${url}?${queryString}`;
  }

  /**
   * 发起HTTP请求
   * @param params 请求参数
   * @param query url请求参数
   * @param config 请求配置
   * @param service 请求信息
   */
  async send(params: RequestParams, service: ServiceInterface): Promise<any> {}
}
