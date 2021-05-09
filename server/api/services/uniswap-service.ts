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
      where: { token: "0x29502fe4d233ef0b45c3647101fa1252ce0634bd" }
    ) {
      date
      priceUSD
      dailyVolumeETH
      dailyVolumeToken
      dailyVolumeUSD
      totalLiquidityUSD
    }
    pair(id: "0x30c86753b88d430436b8a6ef23b4c6faa930ad7d") {
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
