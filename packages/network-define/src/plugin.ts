import { iNetwork } from './network';
import { RequestOptions } from './request';
import { NetworkService } from './service';

/**
 * 判断是否是插件，要求有两点：
 * 1、name不为空
 * 2、before或after必须实现一个
 * @param plugin
 * @returns Boolean
 */
export function isNetworkPlugin(plugin: iNetworkPlugin) {
  if (!plugin) return false;
  const { name, before, after } = plugin;
  return name && (before || after);
}

/**
 * 插件场景，自定义插件时，需要implements此协议
 */
export interface iNetworkPlugin {
  /** 插件名称 */
  name: string;
  /** 发起请求前 */
  before?(
    network: iNetwork,
    params: RequestOptions,
    service?: NetworkService
  ): Boolean | RequestOptions;
  /** 请求返回后 */
  after?(
    network: iNetwork,
    response: any,
    service?: NetworkService
  ): Boolean | Response;
}
