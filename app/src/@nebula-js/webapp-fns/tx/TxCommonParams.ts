import { Rate, u, UST } from '@nebula-js/types';
import { MantleFetch } from '@packages/mantle';
import { NetworkInfo, TxResult } from '@terra-dev/wallet-types';
import { CreateTxOptions } from '@terra-money/terra.js';

export interface TxCommonParams {
  // tx
  txFee: u<UST>;
  gasFee: number;
  gasAdjustment: Rate<number>;
  fixedGas: u<UST<number>>;
  // network
  network: NetworkInfo;
  mantleEndpoint: string;
  mantleFetch: MantleFetch;
  post: (tx: CreateTxOptions) => Promise<TxResult>;
  // error handle
  txErrorReporter?: (error: unknown) => string;
}
