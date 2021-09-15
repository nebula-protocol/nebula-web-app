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
import { cw20, CW20Addr, gov, HumanAddr, NEB, u } from '@nebula-js/types';
import { pipe } from '@rx-stream/pipe';
import { MsgExecuteContract, StdFee } from '@terra-money/terra.js';
import { Observable } from 'rxjs';
import { govStakerQuery } from '../../queries/gov/staker';

export function govStakeTx(
  $: {
    walletAddr: HumanAddr;
    nebAmount: u<NEB>;
    lockForWeeks: number;
    nebTokenAddr: CW20Addr;
    govAddr: HumanAddr;
    onTxSucceed?: () => void;
  } & TxCommonParams,
): Observable<TxResultRendering> {
  const helper = new TxHelper($);

  return pipe(
    (_: void) => {
      return govStakerQuery(
        $.walletAddr,
        $.govAddr,
        $.mantleEndpoint,
        $.mantleFetch,
      ).then((result) => {
        return {
          value: result!.govStaker,
          phase: TxStreamPhase.POST,
          receipts: [],
        } as TxResultRendering<gov.StakerResponse>;
      });
    },
    ({ value }) => {
      const hasLockEndWeek =
        typeof value.lock_end_week === 'number' && value.lock_end_week > 0;

      const increaseLockTime: MsgExecuteContract[] = [];

      if (hasLockEndWeek) {
        const lockEndWeeks =
          value.lock_end_week! -
          Math.floor(Date.now() / (1000 * 60 * 60 * 24 * 7));

        const increaseWeeks = $.lockForWeeks - lockEndWeeks;

        if (increaseWeeks > 0) {
          increaseLockTime.push(
            new MsgExecuteContract($.walletAddr, $.govAddr, {
              increase_lock_time: {
                increase_weeks: increaseWeeks,
              },
            } as gov.IncreaseLockTime),
          );
        }
      }

      return _createTxOptions({
        msgs: [
          ...increaseLockTime,
          new MsgExecuteContract($.walletAddr, $.nebTokenAddr, {
            send: {
              contract: $.govAddr,
              amount: $.nebAmount,
              msg: Buffer.from(
                JSON.stringify({
                  stake_voting_tokens:
                    !hasLockEndWeek && $.lockForWeeks > 0
                      ? {
                          lock_for_weeks: $.lockForWeeks,
                        }
                      : {},
                } as gov.StakeVotingTokens),
              ).toString('base64'),
            },
          } as cw20.Send<NEB>),
        ],
        fee: new StdFee($.gasWanted, floor($.txFee) + 'uusd'),
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
