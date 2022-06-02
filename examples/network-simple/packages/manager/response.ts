/**
 * http请求响应体
 */
export default class Response {
  success: boolean
  code: number
  count: number
  data: object | Array<any>
  msg: string
  time: string

  constructor(props) {
    const { success = true, code, count, data, msg, time } = (props || {})
    this.success = success
    this.code = code
    this.count = count
    this.data = data
    this.msg = msg
    this.time = time
  }
}