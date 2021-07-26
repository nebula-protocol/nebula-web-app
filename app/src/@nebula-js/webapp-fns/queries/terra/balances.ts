import {
  cw20,
  HumanAddr,
  NativeDenom,
  terraswap,
  Token,
  u,
} from '@nebula-js/types';
import { mantle, MantleParams } from '@terra-money/webapp-fns';

// language=graphql
export const TERRA_BALANCES_QUERY = `
  query ($walletAddress: String!) {
    nativeTokenBalances: BankBalancesAddress(Address: $walletAddress) {
      Result {
        Denom
        Amount
      }
    }
  }
`;

export interface TerraBalancesQueryVariables {
  walletAddress: HumanAddr;
}

export interface TerraBalancesQueryResult {
  nativeTokenBalances: {
    Result: Array<{ Denom: NativeDenom; Amount: u<Token> }>;
  };
}

export type TerraBalances = {
  balances: Array<{ asset: terraswap.AssetInfo; balance: u<Token> }>;
  balancesIndex: Map<terraswap.AssetInfo, u<Token>>;
};

export type TerraBalancesQueryParams = Omit<
  MantleParams<{}>,
  'wasmQuery' | 'query' | 'variables'
> & {
  assets: terraswap.AssetInfo[];
  walletAddress: HumanAddr;
};

export async function terraBalancesQuery({
  mantleEndpoint,
  mantleFetch,
  assets,
  walletAddress,
  requestInit,
}: TerraBalancesQueryParams): Promise<TerraBalances> {
  type CW20Query = Record<
    string,
    { contractAddress: string; query: cw20.Balance }
  >;

  const wasmQuery: CW20Query = assets.reduce((wq, asset, i) => {
    if ('token' in asset) {
      wq['asset' + i] = {
        contractAddress: asset.token.contract_addr,
        query: {
          balance: {
            address: walletAddress,
          },
        },
      };
    }
    return wq;
  }, {} as CW20Query);

  const result = await mantle<
    any,
    TerraBalancesQueryVariables,
    TerraBalancesQueryResult
  >({
    mantleEndpoint: `${mantleEndpoint}?terra-balances=${walletAddress}`,
    mantleFetch,
    variables: {
      walletAddress,
    },
    wasmQuery,
    query: TERRA_BALANCES_QUERY,
    requestInit,
  });

  const balances = assets.map((asset, i) => {
    if ('token' in asset) {
      const cw20Balance: cw20.BalanceResponse<Token> = result[
        'asset' + i
      ] as any;
      return { asset, balance: cw20Balance.balance };
    }

    const nativeAsset = result.nativeTokenBalances.Result.find(
      ({ Denom }) => asset.native_token.denom === Denom,
    );

    return { asset, balance: nativeAsset?.Amount ?? ('0' as u<Token>) };
  });

  const balancesIndex = new Map<terraswap.AssetInfo, u<Token>>();

  for (const { asset, balance } of balances) {
    balancesIndex.set(asset, balance);
  }

  return { balances, balancesIndex };
}
