/* eslint-disable @typescript-eslint/no-explicit-any */
import L from '../../common/logger';
import ethplorerService from './ethplorer-service';
import uniswapService from './uniswap-service';
import ethScanService from './ethscan-service';

const TOTAL_SUPPLY = 1000000000000000000;
const BILLION = 1000000000;

export class StatsService {
  async get(): Promise<any> {
    L.info('fetch stats');

    return Promise.all([
      uniswapService.getDayData(),
      ethplorerService.getTokenInfo(),
      ethplorerService.getTokenTopHolders(20),
      ethScanService.getBurnedBalance(),
      ethScanService.getDonationsBalance(),
      //coingeckoService.getCoinInfo(),
    ])
      .then((result) => {
        const uniData: any = result[0].data;
        const tokenInfo: any = result[1];
        const topTokenHolders = result[2];
        const burnBalance = result[3];
        const donationBalance = result[4];
        // const coingeckoData = result[5];
        const price = uniData.pair.token1Price * uniData.bundle.ethPrice;
        const circulatingSupply = TOTAL_SUPPLY - burnBalance.result / BILLION;

        L.info('uniData :>> ', uniData);
        return {
          dayData: uniData.tokenDayDatas.map((data: any) => {
            const { date, dailyVolumeUSD, totalLiquidityUSD, priceUSD } = data;
            return {
              date,
              dailyVolumeUSD,
              totalLiquidityUSD,
              priceUSD,
            };
          }),
          totalLiquidityUSD: uniData.pair.reserveUSD,
          price,
          marketCap: this.calculateMarketCap(price, circulatingSupply),
          supply: {
            total: TOTAL_SUPPLY,
            circulating: circulatingSupply,
          },
          donations: {
            balance: (donationBalance.result / BILLION) * price,
          },
          burn: { balance: burnBalance.result / BILLION },
          topHolders: {
            totalShare: this.calculateTotalShare(topTokenHolders.holders),
            holders: this.calculateTopHolders(topTokenHolders.holders),
          },
          tokenInfo: {
            holders: tokenInfo.holdersCount,
            lastUpdated: tokenInfo.lastUpdated,
            address: tokenInfo.address,
            owner: tokenInfo.owner,
            name: tokenInfo.name,
          },
        };
      })
      .catch((err) => {
        console.log('err :>> ', err);
        return err;
      });
  }
  calculateTopHolders(holders: any[]): any[] {
    return holders.filter((e) => {
      return (
        e.address !== process.env.BURN_ADDRESS &&
        e.address !== process.env.DONATION_ADDRESS
      );
    });
  }

  // Calculate total share minus the burn address
  calculateTotalShare(holders: any[]): number {
    return holders
      .filter((e) => {
        return (
          e.address !== process.env.BURN_ADDRESS &&
          e.address !== process.env.DONATION_ADDRESS
        );
      })
      .reduce((prev, current) => {
        return prev + current.share;
      }, 0);
  }

  calculateMarketCap(price: number, circulatingSupply: number): number {
    return price * circulatingSupply;
  }
}

export default new StatsService();
