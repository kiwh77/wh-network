import { AxiosRequestConfig } from "axios";
import { RequestInterface } from "./interface";
import { Method } from "../manager/method";
import { ServiceInterface } from "../service/interface";
import HTTPBaseRequest from "./base";

export default class HTTPPatchRequest
  extends HTTPBaseRequest
  implements RequestInterface
{
  method: Method = Method.PATCH;

  async send(body, service: ServiceInterface): Promise<any> {
    const { params = {}, query = {}, path = {}, config = {} } = body;
    // 组合请求参数
    const requestParams: AxiosRequestConfig = {
      ...this.defaultRequestConfig,
      ...config,
      params: query,
      data: params,
      method: this.method
    };
    requestParams.url = this.transformPathParams(service.url, path);
    const result: any = await this.axios.request(requestParams);
    if (result) result.service = service;
    return result;
  }
}
