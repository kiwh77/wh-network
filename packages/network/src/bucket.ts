import MD5 from 'blueimp-md5';
import { RequestOptions } from '@wh/network-define';

export class NetworkBucket {
  requests: { [key: string]: RequestOptions | undefined } = {};

  verify(service: RequestOptions) {
    const { url, method, params, path, body } = service;
    const id = this.buildId({
      url,
      method,
      params,
      path,
      body,
    });
    const request = this.requests[id];
    if (request) return false;
    this.requests[id] = service;
    return true;
  }

  pop(id: string) {
    this.requests[id] = undefined;
  }

  private buildId(params: { [key: string]: any }) {
    const paramStr = Object.keys(params)
      .sort()
      .map((item) => {
        const value = params[item];
        let transformResult;
        if (typeof value === 'object') {
          try {
            transformResult = JSON.stringify(value);
          } catch {}
        } else {
          transformResult = `${item}=${value}`;
        }
        return transformResult;
      })
      .join('&');
    return MD5(paramStr);
  }
}
