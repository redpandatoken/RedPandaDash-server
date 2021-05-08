import L from '../../common/logger';

import { URL, URLSearchParams } from 'url';
import { makeHttpCall } from '../../common/http';

export class EthplorerService {
  private tokenAddress = process.env.REDPANDA_TOKEN_ADDRESS;

  async call(path: string, params?: { [key: string]: unknown }): Promise<any> {
    const url = new URL(process.env.ETHPLORER_API + path);
    url.search = new URLSearchParams({
      ...(params ?? {}),
      apiKey: process.env.ETHPLORER_API_KEY,
    }).toString();

    L.info('Calling: ' + url.toString());
    return await makeHttpCall(url.toString());
  }

  async getTokenInfo(): Promise<any> {
    L.info('fetch ethplorer stats');
    return this.call(`getTokenInfo/${this.tokenAddress}`);
  }

  async getTokenTopHolders(limit: number): Promise<any> {
    L.info('fetch ethplorer top holders');
    return this.call(`getTopTokenHolders/${this.tokenAddress}`, {
      limit,
    });
  }
}

export default new EthplorerService();
