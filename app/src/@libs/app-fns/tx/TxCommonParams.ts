import { QueryClient } from '@libs/query-client';
import { Gas, Rate, u, Luna } from '@libs/types';
import { NetworkInfo, TxResult } from '@terra-money/use-wallet';
import { CreateTxOptions } from '@terra-money/terra.js';

export interface TxCommonParams {
  // tx
  txFee: u<Luna>;
  gasWanted: Gas;
  gasAdjustment: Rate<number>;
  fixedFee: u<Luna<string | number>>;
  // network
  network: NetworkInfo;
  queryClient: QueryClient;
  post: (tx: CreateTxOptions) => Promise<TxResult>;
  // error handle
  txErrorReporter?: (error: unknown) => string;
}
