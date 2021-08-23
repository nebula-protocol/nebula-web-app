import { HumanAddr, terraswap, Token, u, UST } from '@nebula-js/types';
import { pipe } from '@rx-stream/pipe';
import { floor } from '@libs/big-math';
import {
  Coin,
  MsgExecuteContract,
  MsgSend,
  StdFee,
} from '@terra-money/terra.js';
import {
  pickEvent,
  pickRawLog,
  TxResultRendering,
  TxStreamPhase,
} from '@libs/webapp-fns';
import { Observable } from 'rxjs';
import { NebulaTax } from '../../types';
import { _catchTxError } from '../internal/_catchTxError';
import { _createTxOptions } from '../internal/_createTxOptions';
import { _pollTxInfo } from '../internal/_pollTxInfo';
import { _postTx } from '../internal/_postTx';
import { TxHelper } from '../internal/TxHelper';
import { TxCommonParams } from '../TxCommonParams';

export function sendTx(
  $: {
    walletAddr: HumanAddr;
    toAddr: HumanAddr;
    asset: terraswap.AssetInfo;
    memo?: string;
    amount: u<Token>;
    txFee: u<UST>;
    tax: NebulaTax;
    onTxSucceed?: () => void;
  } & TxCommonParams,
): Observable<TxResultRendering> {
  const helper = new TxHelper($);

  return pipe(
    _createTxOptions({
      msgs:
        'native_token' in $.asset
          ? [
              new MsgSend($.walletAddr, $.toAddr, [
                new Coin($.asset.native_token.denom, $.amount),
              ]),
            ]
          : [
              new MsgExecuteContract(
                $.walletAddr,
                $.asset.token.contract_addr,
                {
                  transfer: {
                    recipient: $.toAddr,
                    amount: $.amount,
                  },
                },
              ),
            ],
      fee: new StdFee($.gasFee, floor($.txFee) + 'uusd'),
      gasAdjustment: $.gasAdjustment,
      memo: $.memo,
    }),
    _postTx({ helper, ...$ }),
    _pollTxInfo({ helper, ...$ }),
    ({ value: txInfo }) => {
      const rawLog = pickRawLog(txInfo, 0);

      if (!rawLog) {
        return helper.failedToFindRawLog();
      }

      const fromContract = pickEvent(rawLog, 'from_contract');
      const transfer = pickEvent(rawLog, 'transfer');

      if (!fromContract || !transfer) {
        return helper.failedToFindEvents('from_contract', 'transfer');
      }

      try {
        return {
          value: null,

          phase: TxStreamPhase.SUCCEED,
          receipts: [
            helper.txHashReceipt(),
            //helper.txFeeReceipt(txFee),
          ],
        } as TxResultRendering;
      } catch (error) {
        return helper.failedToParseTxResult();
      }
    },
  )().pipe(_catchTxError({ helper, ...$ }));
}
