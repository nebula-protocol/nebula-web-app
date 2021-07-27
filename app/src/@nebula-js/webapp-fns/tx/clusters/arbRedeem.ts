import {
  CW20Addr,
  HumanAddr,
  incentives,
  terraswap,
  Token,
  u,
} from '@nebula-js/types';
import { pipe } from '@rx-stream/pipe';
import { floor } from '@terra-dev/big-math';
import { MsgExecuteContract, StdFee } from '@terra-money/terra.js';
import {
  pickEvent,
  pickRawLog,
  TxResultRendering,
  TxStreamPhase,
} from '@terra-money/webapp-fns';
import { Observable } from 'rxjs';
import { terraswapPoolQuery } from '../../queries/terraswap/pool';
import { _catchTxError } from '../internal/_catchTxError';
import { _createTxOptions } from '../internal/_createTxOptions';
import { _pollTxInfo } from '../internal/_pollTxInfo';
import { _postTx } from '../internal/_postTx';
import { TxHelper } from '../internal/TxHelper';
import { TxCommonParams } from '../TxCommonParams';

export function clusterArbRedeemTx(
  $: {
    walletAddr: HumanAddr;
    incentivesAddr: HumanAddr;
    clusterAddr: HumanAddr;
    clusterTokenAddr: CW20Addr;
    terraswapPairAddr: HumanAddr;
    assets: terraswap.AssetInfo[];
    amounts: u<Token>[];
    onTxSucceed?: () => void;
  } & TxCommonParams,
): Observable<TxResultRendering> {
  const helper = new TxHelper($);

  //const increaseAllownance = $.assets
  //  .map((asset, i) => {
  //    if ('token' in asset) {
  //      return new MsgExecuteContract($.walletAddr, asset.token.contract_addr, {
  //        increase_allowance: {
  //          spender: $.incentivesAddr,
  //          amount: $.amounts[i],
  //        },
  //      } as cw20.IncreaseAllowance);
  //    } else {
  //      return undefined;
  //    }
  //  })
  //  .filter((contract): contract is MsgExecuteContract => !!contract);
  //
  //const nativeCoins = $.assets
  //  .map((asset, i) => {
  //    if ('native_token' in asset && big($.amounts[i]).gt(0)) {
  //      return new Coin(asset.native_token.denom, $.amounts[i]);
  //    } else {
  //      return undefined;
  //    }
  //  })
  //  .filter((coin): coin is Coin => !!coin);

  return pipe(
    (_: void) => {
      return terraswapPoolQuery({
        mantleEndpoint: $.mantleEndpoint,
        mantleFetch: $.mantleFetch,
        wasmQuery: {
          terraswapPool: {
            contractAddress: $.terraswapPairAddr,
            query: {
              pool: {},
            },
          },
        },
      }).then(({ terraswapPool }) => {
        return {
          value: terraswapPool,
          phase: TxStreamPhase.POST,
          receipts: [],
        } as TxResultRendering<terraswap.pair.PoolResponse<Token, Token>>;
      });
    },
    ({ value }) =>
      _createTxOptions({
        msgs: [
          //...increaseAllownance,
          //new MsgExecuteContract($.walletAddr, $.incentivesAddr, {
          //  swap_all: {
          //    terraswap_pair: $.terraswapPairAddr,
          //    cluster_token: $.clusterAddr,
          //    to_ust: false,
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
          new MsgExecuteContract(
            $.walletAddr,
            $.incentivesAddr,
            {
              arb_cluster_redeem: {
                cluster_contract: $.clusterAddr,
                asset: value.assets.find((asset) => {
                  return (
                    'token' in asset.info &&
                    asset.info.token.contract_addr === $.clusterTokenAddr
                  );
                })!,
              },
            } as incentives.ArbClusterRedeem,
            //nativeCoins.length > 0 ? new Coins(nativeCoins) : undefined,
          ),
          //new MsgExecuteContract($.walletAddr, $.incentivesAddr, {
          //  send_all: {
          //    asset_infos: $.assets,
          //    send_to: $.walletAddr,
          //  },
          //} as incentives.SendAll),
        ],
        fee: new StdFee($.gasFee, floor($.txFee) + 'uusd'),
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
