# @wh/request

网络请求功能封装，主要提供如下功能：

* 内置常用请求处理，支持常用HTTP请求
* 接口对象录入管理，支持集中录入接口基本信息、数据模型等
* 自定义请求处理器，支持替换内置请求处理器
* 自定义功能中间件，支持注册功能中间件处理参数
* 生命周期事件回调，支持请求前后生命周期事件回调
* 核心插件替换功能，支持axios、fetch、uni-app等
* 分片、断点上传

---
## 使用说明

### 安装

```sh
  npm install @wh/request -S
```

### 初始化

```js
  // request.js
  import { RequestManager } from '@wh/request'
  
  const requestManager = new RequestManager({
    services: [],
  })

  export default reqeustManager

  // main.js
  import Vue from 'vue'
  import Request from './request.js'
  Vue.use(Request)

  // or
  // main.js
  
  import RequestManager from '@wh/request'
  
  Vue.use(RequestManager, {
    services: []
  })
```

### 使用示例


#### 返回数据自定义处理

```js
new RequestManager({
  // 请求成功后的数据处理
  fulfillJudge(result, response) {
    // 进行数据判断
    if (result.code === 200) {
      result.success = true
      result.msg = '自定义请求成功提示'
    }
    // 返回处理后的数据结构
    return result
  },
  // 请求失败后的数据处理
  rejectJudge(result, response) {
    return result
  }
})
```

#### 生命周期事件回调

```js
new RequestManager({
  // 请求完成后回调
  callback(event, { result, response, service } = {}) {
    // 进行相应的判断、提示、操作
  }
})
```

#### 接口对象录入管理

```js
const services = [
    {
      name: 'FetchUsers',
      url: '/api/user',
      method: Method.GET,
      feature: ['useToken', 'MyPlugin'],
      tag: ['tag']
    },
  ]

new RequestManager({
  services
})
```

#### 自定义请求处理器

```js
import { Method, BaseRequest } from '@wh/request'

class MyGetReqeust extend BaseRequest implements RequestInterface  {
  method: Method = Method.GET
  axios: AxiosInstance
  async send (reqParams, service): Promise<any> {
    // 实际的请求过程
  } 
}

const request = new RequestManager()

// 加载自定义请求处理器
request.useRequest(Method.GET, new MyGetRequest())
// 取消、恢复请求处理器
request.cancelRequest(Method.GET)

```
#### 自定义功能中间件

```js
class MyPlugin implements PluginInterface {
  name: 'MyPlugin'

  beforeRequest(manager: RequestManager, service: ServiceInterface, reqParams: RequestParams) {
    const { params, query, path, config } = reqParams

    if (!config.headers) config.headers = {}
    config.headers.timestamp = new Date().valueOf()

    return {
      params,
      query,
      path,
      config
    }
  }
  afterResponse(manager: RequestManager, service: ServiceInterface, params: Response) {
    // TODO:请求结束后操作
  }
}

```

#### 页面内发起请求
```js
  export default {
    mounted() {
      const res = await this.$http.dispatch('FetchX', {
        // URL参数
        query: {},
        // URL路径参数
        path: {},
        // 请求body参数
        params: {
          id: 'xxx'
        },
        // 请求配置参数，同axios
        config: {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      })
      if (res && res.success) {
        this.data = res.data
      }

      const response = await this.$http.send({
        url: '/api/user',
        feature: 'useToken'
      }, {
        params: {
          id: 'xxx'
        },
        query: {
          id: 'xxx'
        },
        path: {
          id: 'xxxx'
        },
        config: {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      })
    },
  }
```

### 初始化参数

| 参数名       | 类型     | 描述         | 可选值 | 默认值 |
| ------------ | -------- | ------------ | ------ | ------ |
| services     | Array    | 接口         | -      | -      |
| callback     | Function | 拦截器回调   | -      |        |
| fulfillJudge | Function | 成功处理函数 |        |        |
| rejectJudge  | Function | 失败处理函数 |        |        |

### 实例方法

| 方法名          | 描述                                                   | 参数                                                                                                      |
| --------------- | ------------------------------------------------------ | --------------------------------------------------------------------------------------------------------- |
| registerEvent   | 注册事件回调，回调事件类型                             | event: [RequestEvent](#requestevents-请求事件类型), handler: Function                                     |
| unregisterEvent | 解除事件回调                                           | event: [RequestEvent](#requestevents-请求事件类型)                                                        |
| useRequest      | 注册请求处理器                                         | method: [Method](#method-请求方法), request: [BaseRequest](#baserequest-请求处理器基类)                   |
| unuseRequest    | 解除请求处理器，如解除是的HTTP类型的，会恢复默认处理器 | method: [Method](#method-请求方法)                                                                        |
| useStore        | 注册数据                                               | obj: any                                                                                                  |
| dispath         | 调用注册的接口                                         | name: string,params:[RequestParams](#requestparams-请求参数)                                              |
| send            | 发送请求                                               | service: [ServiceInterface](#serviceinterface-请求接口), params: [RequestParams](#requestparams-请求参数) |


#### RequestEvents 请求事件类型

```js
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
```

#### Method 请求方法

```js
export enum Method {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  DELETE = 'delete',
  PATCH = 'patch'
}
```

#### BaseRequest 请求处理器基类

```js
export declare interface RequestInterface {
  method: Method;
  // axios实例
  axios: AxiosInstance;
  /**
   * 发起请求
   */
  send(body: RequestParams, service: ServiceInterface): Promise<any>;
}

```

#### RequestParams 请求参数

```js
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
  config?: AxiosRequestConfig
}
```

#### ServiceInterface 请求接口

```js
export declare interface ServiceInterface {
  /**
   * 服务名
   */
  name: string,
  /**
   * 服务url
   */
  url: string
  /**
   * 服务标签
   */
  tag?: Array<string>,
  /**
   * 服务类型
   */
  method: Method
  /**
   * 默认参数
   */
  defaultParams?: object;
  /**
   * 特性
   */
  feature?: Array<Feature> | Feature;
  /**
   * 请求前的勾子
   */
  beforeRequest?: Function,
  /**
   * 请求返回后的勾子
   */
  afterResponse?: Function
}
```

### 依赖

---

### 使用共识？

---
## 特点？

---
## 作者/维护者
| 名称 | 联系方式          | 参与部分     |
| ---- | ----------------- | ------------ |
| 吴浩 | wuhaowh@wh.com.cn | 初始版本开发 |

