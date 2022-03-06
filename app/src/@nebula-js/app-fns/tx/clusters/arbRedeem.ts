import { floor } from '@libs/big-math';
import {
  pickEvent,
  pickRawLog,
  terraswapSimulationQuery,
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
import {
  terraswap,
  HumanAddr,
  incentives,
  u,
  UST,
  Rate,
  Token,
} from '@nebula-js/types';
import { pipe } from '@rx-stream/pipe';
import { Coin, Coins, MsgExecuteContract, Fee } from '@terra-money/terra.js';
import { Observable } from 'rxjs';
import { computeMinReceivedAmount } from '@nebula-js/app-fns';

export function clusterArbRedeemTx(
  $: {
    walletAddr: HumanAddr;
    incentivesAddr: HumanAddr;
    clusterAddr: HumanAddr;
    terraswapPairAddr: HumanAddr;
    amount: u<UST>;
    maxSpread: Rate;
    onTxSucceed?: () => void;
  } & TxCommonParams,
): Observable<TxResultRendering> {
  const helper = new TxHelper($);

  return pipe(
    (_: void) => {
      return terraswapSimulationQuery(
        $.terraswapPairAddr,
        {
          amount: $.amount,
          info: {
            native_token: {
              denom: 'uusd',
            },
          },
        },
        $.queryClient,
      ).then(({ simulation }) => {
        return {
          value: simulation,
          phase: TxStreamPhase.POST,
          receipts: [],
        } as TxResultRendering<terraswap.pair.SimulationResponse<Token, Token>>;
      });
    },
    ({ value: { return_amount } }) => {
      const minReceivedUCT = computeMinReceivedAmount(
        return_amount,
        $.maxSpread,
      );

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
                      denom: 'uusd',
                    },
                  },
                  amount: $.amount,
                },
                min_cluster: minReceivedUCT,
              },
            } as incentives.ArbClusterRedeem,
            new Coins([new Coin('uusd', $.amount)]),
          ),
        ],
        fee: new Fee($.gasWanted, floor($.txFee) + 'uusd'),
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
          receipts: [helper.txHashReceipt(), helper.txFeeReceipt($.txFee)],
        } as TxResultRendering;
      } catch (error) {
        return helper.failedToParseTxResult();
      }
    },
  )().pipe(_catchTxError({ helper, ...$ }));
}
