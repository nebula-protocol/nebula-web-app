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
import { floor } from '@libs/big-math';
import { cw20, CW20Addr, gov, HumanAddr, NEB, u } from '@nebula-js/types';
import { pipe } from '@rx-stream/pipe';
import { MsgExecuteContract, Fee } from '@terra-money/terra.js';
import { Observable } from 'rxjs';

export function govStakeTx(
  $: {
    walletAddr: HumanAddr;
    nebAmount: u<NEB>;
    nebTokenAddr: CW20Addr;
    govAddr: HumanAddr;
    onTxSucceed?: () => void;
  } & TxCommonParams,
): Observable<TxResultRendering> {
  const helper = new TxHelper($);

  return pipe(
    _createTxOptions({
      msgs: [
        new MsgExecuteContract($.walletAddr, $.nebTokenAddr, {
          send: {
            contract: $.govAddr,
            amount: $.nebAmount,
            msg: Buffer.from(
              JSON.stringify({
                stake_voting_tokens: {},
              } as gov.StakeVotingTokens),
            ).toString('base64'),
          },
        } as cw20.Send<NEB>),
      ],
      fee: new Fee($.gasWanted, floor($.txFee) + 'uusd'),
      gasAdjustment: $.gasAdjustment,
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
          receipts: [helper.txHashReceipt()],
        } as TxResultRendering;
      } catch (error) {
        return helper.failedToParseTxResult();
      }
    },
  )().pipe(_catchTxError({ helper, ...$ }));
}
