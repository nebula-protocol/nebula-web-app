import {
  cw20,
  CW20Addr,
  HumanAddr,
  LP,
  LPAddr,
  staking,
  u,
} from '@nebula-js/types';
import { pipe } from '@rx-stream/pipe';
import { floor } from '@libs/big-math';
import { MsgExecuteContract, StdFee } from '@terra-money/terra.js';
import {
  pickEvent,
  pickRawLog,
  TxResultRendering,
  TxStreamPhase,
} from '@libs/webapp-fns';
import { Observable } from 'rxjs';
import { _catchTxError } from '../internal/_catchTxError';
import { _createTxOptions } from '../internal/_createTxOptions';
import { _pollTxInfo } from '../internal/_pollTxInfo';
import { _postTx } from '../internal/_postTx';
import { TxHelper } from '../internal/TxHelper';
import { TxCommonParams } from '../TxCommonParams';

export function stakingUnstakeTx(
  $: {
    walletAddr: HumanAddr;
    lpAmount: u<LP>;
    stakingAddr: HumanAddr;
    tokenAddr: CW20Addr;
    lpAddr: LPAddr;
    tokenUstPairAddr: HumanAddr;
    onTxSucceed?: () => void;
  } & TxCommonParams,
): Observable<TxResultRendering> {
  const helper = new TxHelper($);

  return pipe(
    _createTxOptions({
      msgs: [
        new MsgExecuteContract($.walletAddr, $.stakingAddr, {
          unbond: {
            asset_token: $.tokenAddr,
            amount: $.lpAmount,
          },
        } as staking.Unbond),
        new MsgExecuteContract($.walletAddr, $.lpAddr, {
          send: {
            amount: $.lpAmount,
            contract: $.tokenUstPairAddr,
            msg: Buffer.from(
              JSON.stringify({
                withdraw_liquidity: {},
              }),
            ).toString('base64'),
          },
        } as cw20.Send<LP>),
      ],
      fee: new StdFee($.gasFee, floor($.txFee) + 'uusd'),
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
