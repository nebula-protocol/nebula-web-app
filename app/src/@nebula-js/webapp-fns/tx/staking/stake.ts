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
import {
  cw20,
  CW20Addr,
  HumanAddr,
  Rate,
  staking,
  Token,
  u,
  UST,
} from '@nebula-js/types';
import { pipe } from '@rx-stream/pipe';
import { Coin, Coins, MsgExecuteContract, StdFee } from '@terra-money/terra.js';
import { Observable } from 'rxjs';

export function stakingStakeTx(
  $: {
    walletAddr: HumanAddr;
    ustAmount: u<UST>;
    tokenAmount: u<Token>;
    stakingAddr: HumanAddr;
    tokenAddr: CW20Addr;
    slippageTolerance: Rate;
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
                      denom: 'uusd',
                    },
                  },
                  amount: $.ustAmount,
                },
              ],
              slippage_tolerance: $.slippageTolerance,
            },
          } as staking.AutoStake<UST, Token>,
          new Coins([new Coin('uusd', $.ustAmount)]),
        ),
      ],
      fee: new StdFee($.gasWanted, floor($.txFee) + 'uusd'),
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
