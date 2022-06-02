import { RequestManager } from '../manager'
import { PluginInterface } from "./interface";
import { RequestParams } from "../manager/interface";
import { ServiceInterface } from "../service/interface";

export default class IsUpload implements PluginInterface {
   name: string = 'isUpload'
   beforeRequest (manager: RequestManager, service: ServiceInterface, reqParams: RequestParams, action: object): any {
     const { config = {}, ...other } = reqParams
      
     if (!config.headers) config.headers = {}
     config.headers['Content-Type'] = 'multipart/form-data'

     return {
        config,
        ...other
     }
   }
}