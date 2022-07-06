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
import {
  cw20,
  CW20Addr,
  HumanAddr,
  Rate,
  staking,
  Token,
  u,
  Luna,
} from '@nebula-js/types';
import { pipe } from '@rx-stream/pipe';
import { Coin, Coins, MsgExecuteContract, Fee } from '@terra-money/terra.js';
import { Observable } from 'rxjs';

export function stakingStakeTx(
  $: {
    walletAddr: HumanAddr;
    lunaAmount: u<Luna>;
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
                      denom: 'uluna',
                    },
                  },
                  amount: $.lunaAmount,
                },
              ],
              slippage_tolerance: $.slippageTolerance,
            },
          } as staking.AutoStake<Luna, Token>,
          new Coins([new Coin('uluna', $.lunaAmount)]),
        ),
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
          receipts: [helper.txHashReceipt(), helper.txFeeReceipt($.txFee)],
        } as TxResultRendering;
      } catch (error) {
        return helper.failedToParseTxResult();
      }
    },
  )().pipe(_catchTxError({ helper, ...$ }));
}
