
/**
 * 请求中事件类型
 */
 export enum RequestEvents {
  // 接口调用成功，数据返回成功
  onRespondSuccess = 'onRespondSuccess',
  // 接口调用失败，未返回数据
  onRespondFail = 'onRespondFail',
  // 请求前数据处理成功
  onRequestSuccess = 'onRequestSuccess',
  // 请求前数据处理失败
  onRequestFail = 'onRequestFail'
}