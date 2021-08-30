import { HumanAddr, incentives, NativeDenom, u, UST } from '@nebula-js/types';
import { pipe } from '@rx-stream/pipe';
import { floor } from '@libs/big-math';
import { Coin, Coins, MsgExecuteContract, StdFee } from '@terra-money/terra.js';
import {
  pickEvent,
  pickRawLog,
  TxResultRendering,
  TxStreamPhase,
} from '@libs/webapp-fns';
import { Observable } from 'rxjs';
import { _catchTxError } from '@libs/webapp-fns/tx/internal/_catchTxError';
import { _createTxOptions } from '@libs/webapp-fns/tx/internal/_createTxOptions';
import { _pollTxInfo } from '@libs/webapp-fns/tx/internal/_pollTxInfo';
import { _postTx } from '@libs/webapp-fns/tx/internal/_postTx';
import { TxHelper } from '@libs/webapp-fns/tx/internal/TxHelper';
import { TxCommonParams } from '@libs/webapp-fns/tx/TxCommonParams';

export function clusterArbRedeemTx(
  $: {
    walletAddr: HumanAddr;
    incentivesAddr: HumanAddr;
    clusterAddr: HumanAddr;
    amount: u<UST>;
    onTxSucceed?: () => void;
  } & TxCommonParams,
): Observable<TxResultRendering> {
  const helper = new TxHelper($);

  return pipe(
    (_: void) => {
      return _createTxOptions({
        msgs: [
          new MsgExecuteContract(
            $.walletAddr,
            $.incentivesAddr,
            {
              arb_cluster_redeem: {
                cluster_contract: $.clusterAddr,
                asset: {
                  info: {
                    native_token: {
                      denom: 'uusd' as NativeDenom,
                    },
                  },
                  amount: $.amount,
                },
              },
            } as incentives.ArbClusterRedeem,
            new Coins([new Coin('uusd', $.amount)]),
          ),
        ],
        fee: new StdFee($.gasFee, floor($.txFee) + 'uusd'),
        gasAdjustment: $.gasAdjustment,
      })();
    },
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
