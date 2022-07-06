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
import { HumanAddr, gov, NEB, u, CW20Addr, cw20 } from '@nebula-js/types';
import { pipe } from '@rx-stream/pipe';
import { MsgExecuteContract, Fee } from '@terra-money/terra.js';
import { Observable } from 'rxjs';

export function govRestakeRewardsTx(
  $: {
    walletAddr: HumanAddr;
    nebTokenAddr: CW20Addr;
    rewardAmount: u<NEB>;
    govAddr: HumanAddr;
    onTxSucceed?: () => void;
  } & TxCommonParams,
): Observable<TxResultRendering> {
  const helper = new TxHelper($);

  return pipe(
    _createTxOptions({
      msgs: [
        new MsgExecuteContract($.walletAddr, $.govAddr, {
          withdraw_voting_rewards: {},
        }),
        new MsgExecuteContract($.walletAddr, $.nebTokenAddr, {
          send: {
            contract: $.govAddr,
            amount: $.rewardAmount,
            msg: Buffer.from(
              JSON.stringify({
                stake_voting_tokens: {},
              } as gov.StakeVotingTokens),
            ).toString('base64'),
          },
        } as cw20.Send<NEB>),
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
          receipts: [helper.txHashReceipt()],
        } as TxResultRendering;
      } catch (error) {
        return helper.failedToParseTxResult();
      }
    },
  )().pipe(_catchTxError({ helper, ...$ }));
}
