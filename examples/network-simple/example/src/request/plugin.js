
/**
 * 自定义插件，打印参数
 */
export const ConsoleParams = {
  name: 'ConsoleParams',
  beforeRequest(manager, service, reqParams, action) {
    console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
    console.log('当前使用请求管理实例为 ： ', manager)
    console.log('当前请求接口为 : ', service)
    console.log('当前请求的参数为 : ', reqParams)
    console.log('当前调用方法是否通过Vuex : ', action ? "是" : '否')
    console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
    return reqParams
  }
}