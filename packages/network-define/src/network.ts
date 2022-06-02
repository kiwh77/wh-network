import { iNetworkPlugin } from './plugin';
import { RequestParams } from './request';
import { NetworkService } from './service';

export interface iNetwork {
  readonly allowRepeatedRequests: Boolean;

  readonly plugins: Array<iNetworkPlugin>;
  readonly services: Array<NetworkService>;

  use(plugin: any): void;

  send(options?: RequestParams & Pick<NetworkService, 'name'>): Promise<any>;
}
