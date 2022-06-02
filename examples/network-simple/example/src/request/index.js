import { RequestManager, RequestEvents } from '@wh/request';
import services from './services';
import { ConsoleParams } from './plugin';

const requestManager = new RequestManager({
  services,
  // 请求成功后回调处理函数
  fulfillJudge(result, response) {
    console.log('[REQ_HANDLER] fulfillJudge ', result, response);
    return result;
  },
  // 请求失败后回调处理函数
  rejectJudge(result, response) {
    console.log('[REQ_HANDLER] rejectJudge ', result, response);
    return result;
  },
  // 请求事件回调
  callback(event, data) {
    switch (event) {
      case RequestEvents.onRequestSuccess:
        console.log('[CALLBACK] RequestEvents.onRequestSuccess', data);
        break;
      case RequestEvents.onRequestFail:
        console.log('[CALLBACK] RequestEvents.onRequestFail', data);
        break;
      case RequestEvents.onRespondSuccess:
        console.log('[CALLBACK] RequestEvents.onRequestSuccess', data);
        break;
      case RequestEvents.onRespondFail:
        console.log('[CALLBACK] RequestEvents.onRespondFail', data);
        break;
    }
  },
});

requestManager.usePlugin(ConsoleParams);

export default requestManager;
