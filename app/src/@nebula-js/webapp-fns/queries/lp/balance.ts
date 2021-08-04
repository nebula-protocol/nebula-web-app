import { HumanAddr, LP, lp, terraswap } from '@nebula-js/types';
import { MantleParams, WasmQuery } from '@terra-dev/mantle';
import { CW20Balance, cw20BalanceQuery } from '../cw20/balance';
import { terraswapPoolQuery } from '../terraswap/pool';
import { lpMinterQuery } from './minter';

export interface LpBalanceWasmQuery {
  minter: WasmQuery<lp.Minter, lp.Minter>;
}

export type LpBalance = CW20Balance<LP>;

export type LpBalanceQueryParams = Omit<
  MantleParams<LpBalanceWasmQuery>,
  'query' | 'variables'
> & {
  walletAddress: HumanAddr;
};

export async function lpBalanceQuery({
  mantleEndpoint,
  wasmQuery,
  walletAddress,
  ...params
}: LpBalanceQueryParams): Promise<LpBalance> {
  const { minter } = await lpMinterQuery({
    mantleEndpoint,
    wasmQuery,
    ...params,
  });

  const { terraswapPool } = await terraswapPoolQuery({
    mantleEndpoint,
    wasmQuery: {
      terraswapPool: {
        contractAddress: minter.minter,
        query: {
          pool: {},
        },
      },
    },
    ...params,
  });

  const token: terraswap.CW20Asset<LP> = terraswapPool.assets.find(
    (asset): asset is terraswap.CW20Asset<LP> => 'token' in asset.info,
  )!;

  return cw20BalanceQuery<LP>({
    mantleEndpoint,
    wasmQuery: {
      tokenBalance: {
        contractAddress: token.info.token.contract_addr,
        query: {
          balance: {
            address: walletAddress,
          },
        },
      },
    },
    ...params,
  });
}
