import L from '../../common/logger';

import ApolloClient, { gql } from 'apollo-boost';
import fetch from 'cross-fetch';

const client = new ApolloClient({
  uri: process.env.UNISWAP_API,
  fetch: fetch,
  request: async (operation) => {
    console.log('operation :>> ', operation);
  },
});

const GET_DAY_DATA = gql`
  {
    bundle(id: "1") {
      ethPrice
    }
    tokenDayDatas(
      first: 3
      orderBy: date
      orderDirection: desc
      where: { token: "0x514cdb9cd8a2fb2bdcf7a3b8ddd098caf466e548" }
    ) {
      date
      priceUSD
      dailyVolumeETH
      dailyVolumeToken
      dailyVolumeUSD
      totalLiquidityUSD
    }
    pair(id: "0xecbc16e251846d1d37c140d83319690783d0d756") {
      token1Price
      reserveUSD
    }
  }
`;

export class UniswapService {
  async getDayData(): Promise<any> {
    L.info('query uniswap');
    return client.query({ query: GET_DAY_DATA, fetchPolicy: 'no-cache' });
  }
}

export default new UniswapService();
