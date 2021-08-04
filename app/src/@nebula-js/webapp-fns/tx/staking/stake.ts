import {
  cw20,
  CW20Addr,
  HumanAddr,
  NativeDenom,
  staking,
  Token,
  u,
  UST,
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
import { Observable } from 'rxjs';
import { _catchTxError } from '../internal/_catchTxError';
import { _createTxOptions } from '../internal/_createTxOptions';
import { _pollTxInfo } from '../internal/_pollTxInfo';
import { _postTx } from '../internal/_postTx';
import { TxHelper } from '../internal/TxHelper';
import { TxCommonParams } from '../TxCommonParams';

export function stakingStakeTx(
  $: {
    walletAddr: HumanAddr;
    ustAmount: u<UST>;
    tokenAmount: u<Token>;
    stakingAddr: HumanAddr;
    tokenAddr: CW20Addr;
    tokenUstPairAddr: HumanAddr;
    onTxSucceed?: () => void;
  } & TxCommonParams,
): Observable<TxResultRendering> {
  const helper = new TxHelper($);

  return pipe(
    _createTxOptions({
      msgs: [
        new MsgExecuteContract($.walletAddr, $.tokenAddr, {
          increase_allowance: {
            spender: $.stakingAddr,
            amount: $.tokenAmount,
          },
        } as cw20.IncreaseAllowance),
        new MsgExecuteContract(
          $.walletAddr,
          $.stakingAddr,
          {
            auto_stake: {
              assets: [
                {
                  info: {
                    token: {
                      contract_addr: $.tokenAddr,
                    },
                  },
                  amount: $.tokenAmount,
                },
                {
                  info: {
                    native_token: {
                      denom: 'uusd' as NativeDenom,
                    },
                  },
                  amount: $.ustAmount,
                },
              ],
              slippage_tolerance: '0.01',
            },
          } as staking.AutoStake<UST, Token>,
          new Coins([new Coin('uusd', $.ustAmount)]),
        ),
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
