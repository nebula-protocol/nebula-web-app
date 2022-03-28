import { cw20PoolInfoQuery } from '@libs/app-fns';
import { oraclePriceQuery } from '@nebula-js/app-fns';
import { CW20Addr, HumanAddr, terraswap, Token, UST } from '@nebula-js/types';
import { QueryClient } from '@libs/query-client';
import big from 'big.js';
import { anchorAUSTRateQuery } from '../anchor/base';

export type SwapPriceList = {
  buyTokenPrice: UST;
  sellTokenPrice: Token;
  info: terraswap.AssetInfo;
  tokenUstPairAddr?: HumanAddr;
}[];

export async function swapPriceListQuery(
  assets: terraswap.Asset<Token>[],
  terraswapFactoryAddr: HumanAddr,
  anchorProxyAddr: HumanAddr,
  oracleAddr: HumanAddr,
  aUSTTokenAddr: CW20Addr,
  queryClient: QueryClient,
): Promise<SwapPriceList> {
  return await Promise.all(
    assets.map(async ({ info }) => {
      if ('native_token' in info) {
        const {
          oraclePrice: { rate },
        } = await oraclePriceQuery(
          oracleAddr,
          info,
          { native_token: { denom: 'uusd' } },
          queryClient,
        );

        return {
          info,
          buyTokenPrice: rate as UST,
          sellTokenPrice: big(1).div(rate).toFixed() as Token,
        };
      } else {
        // aUST
        if (info.token.contract_addr === aUSTTokenAddr) {
          const {
            anchorBase: { rate },
          } = await anchorAUSTRateQuery(anchorProxyAddr, queryClient);
          return {
            info,
            buyTokenPrice: rate,
            sellTokenPrice: big(1).div(rate).toFixed() as Token,
          };
        }

        const {
          terraswapPoolInfo: { tokenPrice },
          terraswapPair,
        } = await cw20PoolInfoQuery(
          info.token.contract_addr,
          terraswapFactoryAddr,
          queryClient,
        );

        return {
          info,
          buyTokenPrice: tokenPrice,
          sellTokenPrice: big(1).div(tokenPrice).toFixed() as Token,
          tokenUstPairAddr: terraswapPair.contract_addr,
        };
      }
    }),
  );
}
