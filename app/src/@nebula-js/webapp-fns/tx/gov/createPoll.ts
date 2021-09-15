import { floor } from '@libs/big-math';
import {
  pickEvent,
  pickRawLog,
  TxCommonParams,
  TxResultRendering,
  TxStreamPhase,
} from '@libs/webapp-fns';
import {
  _catchTxError,
  _createTxOptions,
  _pollTxInfo,
  _postTx,
  TxHelper,
} from '@libs/webapp-fns/tx/internal';
import { CW20Addr, gov, HumanAddr, NEB, u } from '@nebula-js/types';
import { pipe } from '@rx-stream/pipe';
import { MsgExecuteContract, StdFee } from '@terra-money/terra.js';
import { Observable } from 'rxjs';
import { NebulaTax } from '../../types';

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
    tax: NebulaTax;
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
                  execute_msg: $.execute_msg,
                },
              } as gov.CreatePoll),
            ).toString('base64'),
          },
        }),
      ],
      fee: new StdFee($.gasWanted, floor($.txFee) + 'uusd'),
      gasAdjustment: $.gasAdjustment,
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
