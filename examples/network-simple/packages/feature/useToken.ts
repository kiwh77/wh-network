import { RequestManager } from "../manager";
import { RequestParams } from "../manager/interface";
import { ServiceInterface } from "../service/interface";
import { PluginInterface } from "./interface";
import Response from '../manager/response';

export default class UseToken implements PluginInterface {
   name: string = 'useToken'
   beforeRequest (manager: RequestManager, service: ServiceInterface, params: RequestParams, action: object): any {
      const { token } = manager.store
      const { config = {}, ...other } = params
         
      if (!config.headers) config.headers = {}
      config.headers.Authorization = token
      
      return {
         config,
         ...other
      }
   }

   afterResponse (manager: RequestManager, service: ServiceInterface, response: Response): any {
      
   }
}