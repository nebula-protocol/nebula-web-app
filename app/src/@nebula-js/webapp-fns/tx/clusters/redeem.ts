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
import { CT, cw20, CW20Addr, HumanAddr, incentives, u } from '@nebula-js/types';
import { pipe } from '@rx-stream/pipe';
import { MsgExecuteContract, StdFee } from '@terra-money/terra.js';
import { Observable } from 'rxjs';

export function clusterRedeemTx(
  $: {
    walletAddr: HumanAddr;
    incentivesAddr: HumanAddr;
    clusterAddr: HumanAddr;
    clusterTokenAddr: CW20Addr;
    amount: u<CT>;
    onTxSucceed?: () => void;
  } & TxCommonParams,
): Observable<TxResultRendering> {
  const helper = new TxHelper($);

  return pipe(
    _createTxOptions({
      msgs: [
        new MsgExecuteContract($.walletAddr, $.clusterTokenAddr, {
          increase_allowance: {
            spender: $.incentivesAddr,
            amount: $.amount,
          },
        } as cw20.IncreaseAllowance),
        new MsgExecuteContract($.walletAddr, $.incentivesAddr, {
          redeem: {
            cluster_contract: $.clusterAddr,
            max_tokens: $.amount,
          },
        } as incentives.Redeem),
      ],
      fee: new StdFee($.gasWanted, floor($.txFee) + 'uusd'),
      gasAdjustment: $.gasAdjustment + 0.1,
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
