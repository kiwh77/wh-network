import {
  iNetworkPlugin,
  isNetworkPlugin,
  NetworkService,
  iNetwork,
} from '@wh/network-define';

export enum PluginExecMode {
  before = 'before',
  after = 'after',
}

/**
 * 请求插件处理
 */
export class NetworkPlugin {
  plugins: { [name: string]: iNetworkPlugin } = {};

  push(plugin: iNetworkPlugin) {
    if (isNetworkPlugin(plugin)) {
      this.plugins[plugin.name] = plugin;
    }
  }

  exec(
    features: string[],
    mode: PluginExecMode,
    network: iNetwork,
    params: any,
    service?: NetworkService
  ) {
    let execRes = params;
    features.forEach((feature) => {
      const plugin = this.plugins[feature];
      if (!plugin) return;
      const handler = plugin[mode];
      if (!handler) return;
      const result = handler(network, execRes, service);
      if (result && result !== true) {
        execRes = result;
      }
    });
    return execRes;
  }
}
