import { NetworkRequester, iNetworkRequester, NetworkProps, RequestOptions } from '@wh/network-define';
import { AxiosInstance } from 'axios';
export declare class AxiosRequest extends NetworkRequester implements iNetworkRequester {
    instance: AxiosInstance;
    cancels: {
        [key: string]: Function;
    };
    constructor(options: NetworkProps);
    get(url: string, options: RequestOptions): Promise<any>;
    post(url: string, options: RequestOptions): Promise<any>;
    put(url: string, options: RequestOptions): Promise<any>;
    delete(url: string, options: RequestOptions): Promise<any>;
    patch(url: string, options: RequestOptions): Promise<any>;
    send(options: RequestOptions): Promise<any>;
    cancel(requestId: string): any;
}
