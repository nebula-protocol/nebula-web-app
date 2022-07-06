import { floor } from '@libs/big-math';
import {
  pickEvent,
  pickRawLog,
  TxCommonParams,
  TxResultRendering,
  TxStreamPhase,
} from '@libs/app-fns';
import {
  _catchTxError,
  _createTxOptions,
  _pollTxInfo,
  _postTx,
  TxHelper,
} from '@libs/app-fns/tx/internal';
import { CW20Addr, gov, HumanAddr, NEB, Rate, u, Luna } from '@nebula-js/types';
import { pipe } from '@rx-stream/pipe';
import { MsgExecuteContract, Fee } from '@terra-money/terra.js';
import { Observable } from 'rxjs';

export function govCreatePollTx(
  $: {
    walletAddr: HumanAddr;
    nebTokenAddr: CW20Addr;
    govAddr: HumanAddr;
    depositAmount: u<NEB>;
    title: string;
    description: string;
    link?: string;
    execute_msg?: gov.ExecuteMsg;
    taxRate: Rate;
    maxTaxUUSD: u<Luna>;
    onTxSucceed?: () => void;
  } & TxCommonParams,
): Observable<TxResultRendering> {
  const helper = new TxHelper($);

  return pipe(
    _createTxOptions({
      msgs: [
        new MsgExecuteContract($.walletAddr, $.nebTokenAddr, {
          send: {
            contract: $.govAddr,
            amount: $.depositAmount,
            msg: Buffer.from(
              JSON.stringify({
                create_poll: {
                  title: $.title,
                  description: $.description,
                  link: $.link,
                  execute_msgs: !!$.execute_msg ? [$.execute_msg] : undefined,
                },
              } as gov.CreatePoll),
            ).toString('base64'),
          },
        }),
      ],
      fee: new Fee($.gasWanted, floor($.txFee) + 'uluna'),
      gasAdjustment: $.gasAdjustment,
    }),
    _postTx({ helper, ...$ }),
    _pollTxInfo({ helper, ...$ }),
    ({ value: txInfo }) => {
      const rawLog = pickRawLog(txInfo, 0);

      if (!rawLog) {
        return helper.failedToFindRawLog();
      }

      const fromContract = pickEvent(rawLog, 'wasm');
      const transfer = pickEvent(rawLog, 'transfer');

      if (!fromContract || !transfer) {
        return helper.failedToFindEvents('wasm', 'transfer');
      }

      try {
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
