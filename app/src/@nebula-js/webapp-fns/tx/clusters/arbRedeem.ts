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
import { HumanAddr, incentives, NativeDenom, u, UST } from '@nebula-js/types';
import { pipe } from '@rx-stream/pipe';
import { Coin, Coins, MsgExecuteContract, StdFee } from '@terra-money/terra.js';
import { Observable } from 'rxjs';

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
