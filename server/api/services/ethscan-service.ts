import L from '../../common/logger';

import { URL, URLSearchParams } from 'url';
import { makeHttpCall } from '../../common/http';

export class EthscanService {
  async call(path: string, params?: { [key: string]: unknown }): Promise<any> {
    const url = new URL(process.env.ETHSCAN_API + path);
    url.search = new URLSearchParams({
      ...(params ?? {}),
      apiKey: process.env.ETHSCAN_API_KEY,
    }).toString();

    L.info('Calling: ' + url.toString());
    return await makeHttpCall(url.toString());
  }

  async getBurnedBalance(): Promise<any> {
    L.info('fetch burned');
    return this.getAccountBalance(process.env.BURN_ADDRESS ?? '');
  }

  async getDonationsBalance(): Promise<any> {
    L.info('fetch donation');
    return this.getAccountBalance(process.env.DONATION_ADDRESS ?? '');
  }

  async getAccountBalance(accountAddress: string): Promise<any> {
    L.info('fetch account balance for' + accountAddress);

    const params = {
      module: 'account',
      action: 'tokenbalance',
      contractaddress: process.env.REDPANDA_TOKEN_ADDRESS,
      address: accountAddress,
      tag: 'latest',
    };
    return this.call('', params);
  }
}

export default new EthscanService();
