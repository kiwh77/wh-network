import { PluginInterface } from "./interface";
import { RequestParams } from "../manager/interface";
import { ServiceInterface } from "../service/interface";
import { RequestManager } from "../manager";

export default class IsArrayBody implements PluginInterface {
  name: string = "isArrayBody";
  beforeRequest (manager: RequestManager, service: ServiceInterface, reqParams: RequestParams, action: object): any {
     const { params, ...other } = reqParams
     return {
       params: [params],
       ...other
     }
  }
}
