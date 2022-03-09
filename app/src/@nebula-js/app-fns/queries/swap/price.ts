import {
  cw20PoolInfoQuery,
  terraswapPairQuery,
  terraswapPoolQuery,
} from '@libs/app-fns';
import { CW20Addr, HumanAddr, terraswap, Token, UST } from '@nebula-js/types';
import { QueryClient } from '@libs/query-client';
import big from 'big.js';
import { anchorAUSTRateQuery } from '../anchor/base';

export type SwapPriceList = {
  buyTokenPrice: UST;
  sellTokenPrice: Token;
  info: terraswap.CW20AssetInfo | terraswap.NativeAssetInfo;
  tokenUstPairAddr?: HumanAddr;
}[];

export async function swapPriceListQuery(
  assets: terraswap.Asset<Token>[],
  terraswapFactoryAddr: HumanAddr,
  anchorProxyAddr: HumanAddr,
  aUSTTokenAddr: CW20Addr,
  queryClient: QueryClient,
): Promise<SwapPriceList> {
  return await Promise.all(
    assets.map(async ({ info }) => {
      if ('native_token' in info) {
        if (info.native_token.denom === 'uusd') {
          return {
            info,
            buyTokenPrice: '1' as UST,
            sellTokenPrice: '1' as Token,
          };
        }

        // TODO: uluna

        // Others native token
        const pair = await terraswapPairQuery(
          terraswapFactoryAddr,
          [
            info,
            {
              native_token: {
                denom: 'uusd',
              },
            },
          ],
          queryClient,
        );

        const poolInfo = await terraswapPoolQuery(
          pair.terraswapPair.contract_addr,
          queryClient,
        );

        return {
          info,
          buyTokenPrice: poolInfo.terraswapPoolInfo.tokenPrice,
          sellTokenPrice: big(1)
            .div(poolInfo.terraswapPoolInfo.tokenPrice)
            .toFixed() as Token,
          tokenUstPairAddr: pair.terraswapPair.contract_addr,
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
