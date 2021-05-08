import L from '../../common/logger';

import { URL, URLSearchParams } from 'url';
import { makeHttpCall } from '../../common/http';

export class CoingeckoService {
  async call(path: string, params?: { [key: string]: string }): Promise<any> {
    const url = new URL(process.env.COINGECKO_API + path);
    url.search = new URLSearchParams(params ?? {}).toString();

    L.info('Calling: ' + url.toString());
    return await makeHttpCall(url.toString());
  }

  async getCoinInfo(): Promise<any> {
    L.info('fetch coingecko stats');
    return this.call(`coins/froge-finance`, {
      tickers: 'false',
      market_data: 'true',
      community_data: 'true',
      developer_data: 'false',
      sparkline: 'false',
    });
  }
}

export default new CoingeckoService();
