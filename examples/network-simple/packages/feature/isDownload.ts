import { PluginInterface } from "./interface";
import { RequestParams } from "../manager/interface";
import { ServiceInterface } from "../service/interface";
import { RequestManager } from "../manager";

export default class IsDownload implements PluginInterface {
  name: string = "isDownload";
  beforeRequest (manager: RequestManager, service: ServiceInterface, reqParams: RequestParams, action: object): any {
     const { config = {}, ...other } = reqParams

    // TODO:设置
    
     return {
       config,
       ...other
     }
  }
}
