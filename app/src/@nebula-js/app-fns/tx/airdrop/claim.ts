import { Gas, HumanAddr, Rate, u, Luna } from '@nebula-js/types';
import { TxResultRendering, TxStreamPhase } from '@libs/app-fns';
import {
  _catchTxError,
  _createTxOptions,
  _pollTxInfo,
  _postTx,
  TxHelper,
} from '@libs/app-fns/tx/internal';
import { floor } from '@libs/big-math';
import { QueryClient } from '@libs/query-client';
import { pipe } from '@rx-stream/pipe';
import { NetworkInfo, TxResult } from '@terra-money/use-wallet';
import {
  CreateTxOptions,
  Fee,
  MsgExecuteContract,
} from '@terra-money/terra.js';
import { Observable } from 'rxjs';
import { airdropCache } from '@nebula-js/app-fns';
import { Airdrop } from '@nebula-js/app-fns';

export function airdropClaimTx($: {
  airdrop: Airdrop;
  walletAddress: HumanAddr;
  airdropContract: HumanAddr;
  gasFee: Gas;
  gasAdjustment: Rate<number>;
  txFee: u<Luna>;
  network: NetworkInfo;
  queryClient: QueryClient;
  post: (tx: CreateTxOptions) => Promise<TxResult>;
  txErrorReporter?: (error: unknown) => string;
  onTxSucceed?: () => void;
}): Observable<TxResultRendering> {
  const helper = new TxHelper({ ...$ });

  return pipe(
    _createTxOptions({
      msgs: [
        new MsgExecuteContract($.walletAddress, $.airdropContract, {
          claim: {
            stage: $.airdrop.stage,
            amount: $.airdrop.amount.toString(),
            proof: JSON.parse($.airdrop.proof),
          },
        }),
      ],
      fee: new Fee($.gasFee, floor($.txFee) + 'uluna'),
      gasAdjustment: $.gasAdjustment,
    }),
    _postTx({ helper, ...$ }),
    _pollTxInfo({ helper, ...$ }),
    () => {
      try {
        airdropCache.set($.walletAddress, true);

        return {
          value: null,

          phase: TxStreamPhase.SUCCEED,
          receipts: [helper.txHashReceipt(), helper.txFeeReceipt($.txFee)],
        } as TxResultRendering;
      } catch (error) {
        return helper.failedToParseTxResult();
      }
    },
  )().pipe(_catchTxError({ helper, ...$ }));
}
