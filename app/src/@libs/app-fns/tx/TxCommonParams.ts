import { MantleFetch } from '@libs/mantle';
import { Gas, Rate, u, UST } from '@libs/types';
import { NetworkInfo, TxResult } from '@terra-dev/wallet-types';
import { CreateTxOptions } from '@terra-money/terra.js';

export interface TxCommonParams {
  // tx
  txFee: u<UST>;
  gasWanted: Gas;
  gasAdjustment: Rate<number>;
  fixedGas: u<UST<string | number>>;
  // network
  network: NetworkInfo;
  mantleEndpoint: string;
  mantleFetch: MantleFetch;
  post: (tx: CreateTxOptions) => Promise<TxResult>;
  // error handle
  txErrorReporter?: (error: unknown) => string;
}
