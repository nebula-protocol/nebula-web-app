import { floor } from '@libs/big-math';
import {
  pickEvent,
  pickRawLog,
  terraswapPoolQuery,
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
  cw20,
  HumanAddr,
  incentives,
  terraswap,
  Token,
  u,
} from '@nebula-js/types';
import { pipe } from '@rx-stream/pipe';
import { Coin, Coins, MsgExecuteContract, Fee } from '@terra-money/terra.js';
import big from 'big.js';
import { Observable } from 'rxjs';

export function clusterArbMintTx(
  $: {
    walletAddr: HumanAddr;
    incentivesAddr: HumanAddr;
    clusterAddr: HumanAddr;
    terraswapPairAddr: HumanAddr;
    assets: terraswap.Asset<Token>[];
    amounts: u<Token>[];
    onTxSucceed?: () => void;
  } & TxCommonParams,
): Observable<TxResultRendering> {
  const helper = new TxHelper($);

  const increaseAllownance = $.assets
    .map(({ info }, i) => {
      if ('token' in info && big($.amounts[i]).gt(0)) {
        return new MsgExecuteContract($.walletAddr, info.token.contract_addr, {
          increase_allowance: {
            spender: $.incentivesAddr,
            amount: $.amounts[i],
          },
        } as cw20.IncreaseAllowance);
      } else {
        return undefined;
      }
    })
    .filter((contract): contract is MsgExecuteContract => !!contract);

  const nativeCoins = $.assets
    .map(({ info }, i) => {
      if ('native_token' in info && big($.amounts[i]).gt(0)) {
        return new Coin(info.native_token.denom, $.amounts[i]);
      } else {
        return undefined;
      }
    })
    .filter((coin): coin is Coin => !!coin);

  return pipe(
    (_: void) => {
      return terraswapPoolQuery($.terraswapPairAddr, $.queryClient).then(
        ({ terraswapPool }) => {
          return {
            value: terraswapPool,
            phase: TxStreamPhase.POST,
            receipts: [],
          } as TxResultRendering<terraswap.pair.PoolResponse<Token, Token>>;
        },
      );
    },
    ({ value }) =>
      _createTxOptions({
        msgs: [
          ...increaseAllownance,
          new MsgExecuteContract(
            $.walletAddr,
            $.incentivesAddr,
            {
              arb_cluster_create: {
                cluster_contract: $.clusterAddr,
                assets: $.assets
                  .map(({ info }, i) => ({
                    info,
                    amount: $.amounts[i],
                  }))
                  .filter(({ amount }) => big(amount).gt(0)),
              },
            } as incentives.ArbClusterCreate,
            nativeCoins.length > 0 ? new Coins(nativeCoins) : undefined,
          ),
          //new MsgExecuteContract($.walletAddr, $.incentivesAddr, {
          //  swap_all: {
          //    terraswap_pair: $.terraswapPairAddr,
          //    cluster_token: $.clusterAddr,
          //    to_ust: true,
          //  },
          //} as incentives.SwapAll),
          //new MsgExecuteContract($.walletAddr, $.incentivesAddr, {
          //  record_terraswap_impact: {
          //    arbitrager: $.walletAddr,
          //    terraswap_pair: $.terraswapPairAddr,
          //    cluster_contract: $.clusterAddr,
          //    pool_before: value,
          //  },
          //} as incentives.RecordTerraswapImpact),
          //new MsgExecuteContract($.walletAddr, $.incentivesAddr, {
          //  send_all: {
          //    asset_infos: $.assets,
          //    send_to: $.walletAddr,
          //  },
          //} as incentives.SendAll),
        ],
        fee: new Fee($.gasWanted, floor($.txFee) + 'uusd'),
        gasAdjustment: $.gasAdjustment,
      })(),
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
