import { ServiceInterface } from '../service/interface'
import { RequestEvents } from '../request/event'
import { AxiosRequestConfig, Canceler } from 'axios'

export interface RequestParams {
  /**
   * 对应请求体
   */
  params?: Object | Array<any>
  /**
   * 对应url中？后面的参数
   */
  query?: Object
  /**
   * 对应url路径中的参数，以：开头表示
   */
  path?: Object
  /**
   * 配置信息
   */
  config?: AxiosRequestConfig,
  cancel?: (cancel: Canceler) => void
}

// 初始化时参数
export interface InitManagerOptions {
  services?: Array<ServiceInterface>
  // 成功后判断
  fulfillJudge?: Function,
  // 失败后判断
  rejectJudge?: Function,
  callback?: (event: RequestEvents, data: any) => {}
}