import {
  cw20,
  HumanAddr,
  incentives,
  terraswap,
  Token,
  u,
} from '@nebula-js/types';
import { pipe } from '@rx-stream/pipe';
import { floor } from '@terra-dev/big-math';
import { Coin, Coins, MsgExecuteContract, StdFee } from '@terra-money/terra.js';
import {
  pickEvent,
  pickRawLog,
  TxResultRendering,
  TxStreamPhase,
} from '@terra-money/webapp-fns';
import big from 'big.js';
import { Observable } from 'rxjs';
import { _catchTxError } from '../internal/_catchTxError';
import { _createTxOptions } from '../internal/_createTxOptions';
import { _pollTxInfo } from '../internal/_pollTxInfo';
import { _postTx } from '../internal/_postTx';
import { TxHelper } from '../internal/TxHelper';
import { TxCommonParams } from '../TxCommonParams';

export function clusterMintTx(
  $: {
    walletAddr: HumanAddr;
    incentivesAddr: HumanAddr;
    clusterAddr: HumanAddr;
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
    _createTxOptions({
      msgs: [
        ...increaseAllownance,
        new MsgExecuteContract(
          $.walletAddr,
          $.incentivesAddr,
          {
            mint: {
              cluster_contract: $.clusterAddr,
              asset_amounts: $.assets
                .map(({ info }, i) => ({
                  info,
                  amount: $.amounts[i],
                }))
                .filter(({ amount }) => big(amount).gt(0)),
            },
          } as incentives.Mint,
          nativeCoins.length > 0 ? new Coins(nativeCoins) : undefined,
        ),
      ],
      fee: new StdFee($.gasFee, floor($.txFee) + 'uusd'),
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
