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
import { HumanAddr } from '@nebula-js/types';
import { pipe } from '@rx-stream/pipe';
import { MsgExecuteContract, Fee } from '@terra-money/terra.js';
import { Observable } from 'rxjs';

export function claimAllRewardsTx(
  $: {
    walletAddr: HumanAddr;
    govAddr: HumanAddr;
    stakingAddr: HumanAddr;
    incentiveAddr: HumanAddr;
    claimStaking: boolean;
    claimGov: boolean;
    claimIncentive: boolean;
    onTxSucceed?: () => void;
  } & TxCommonParams,
): Observable<TxResultRendering> {
  const helper = new TxHelper($);

  const stakingClaimMsg = $.claimStaking
    ? [
        new MsgExecuteContract($.walletAddr, $.stakingAddr, {
          withdraw: {},
        }),
      ]
    : [];

  const govClaimMsg = $.claimGov
    ? [
        new MsgExecuteContract($.walletAddr, $.govAddr, {
          withdraw_voting_rewards: {},
        }),
      ]
    : [];

  const incentiveClaimMsg = $.claimIncentive
    ? [
        new MsgExecuteContract($.walletAddr, $.incentiveAddr, {
          withdraw: {},
        }),
      ]
    : [];

  return pipe(
    _createTxOptions({
      msgs: [...govClaimMsg, ...stakingClaimMsg, ...incentiveClaimMsg],
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
          receipts: [helper.txHashReceipt()],
        } as TxResultRendering;
      } catch (error) {
        return helper.failedToParseTxResult();
      }
    },
  )().pipe(_catchTxError({ helper, ...$ }));
}
