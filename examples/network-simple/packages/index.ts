import BaseRequest from './request/base'
import {RequestManager} from './manager'
import { RequestEvents } from './request/event'
import { RequestInterface } from './request/interface'
import { ServiceInterface } from './service/interface'
import { Method } from './manager/method'
import { RequestParams } from './manager/interface'
import { Feature, PluginInterface } from './feature/interface'
import { AxiosInstance, AxiosRequestConfig, Canceler } from 'axios'

const install = function (Vue, options) {
  if (Vue) {
    Vue.prototype.$http = new RequestManager(options)
  }
}

export default {
  install,
  RequestManager,
  BaseRequest,
  RequestEvents,
  Method,
  Feature,
}

export {
  RequestManager,
  RequestParams,
  RequestEvents,
  RequestInterface,
  BaseRequest,
  Method,
  Feature,
  ServiceInterface,
  PluginInterface,
  AxiosInstance,
  AxiosRequestConfig,
  Canceler
}