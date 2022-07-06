import { floor, min } from '@libs/big-math';
import {
  formatUTokenWithPostfixUnits,
  formatTokenWithPostfixUnits,
} from '@libs/formatter';
import { HumanAddr, Rate, terraswap, Token, u, Luna } from '@libs/types';
import { pipe } from '@rx-stream/pipe';
import { MsgExecuteContract, Fee } from '@terra-money/terra.js';
import big, { Big } from 'big.js';
import { Observable } from 'rxjs';
import { TxResultRendering, TxStreamPhase } from '../../models/tx';
import {
  pickAttributeValueByKey,
  pickEvent,
  pickRawLog,
} from '../../queries/txInfo';
import {
  _catchTxError,
  _createTxOptions,
  _pollTxInfo,
  _postTx,
  TxHelper,
} from '../internal';
import { TxCommonParams } from '../TxCommonParams';

export function cw20BuyTokenTx(
  $: {
    buyerAddr: HumanAddr;
    buyAmount: u<Luna>;
    tokenUstPairAddr: HumanAddr;
    tokenSymbol: string;
    beliefPrice: Luna;
    /** = slippage_tolerance */
    maxSpread: Rate;
    taxRate: Rate;
    maxTaxUUSD: u<Luna>;
    onTxSucceed?: () => void;
  } & TxCommonParams,
): Observable<TxResultRendering> {
  const helper = new TxHelper($);

  return pipe(
    _createTxOptions({
      msgs: [
        new MsgExecuteContract(
          $.buyerAddr,
          $.tokenUstPairAddr,
          {
            swap: {
              offer_asset: {
                amount: $.buyAmount,
                info: {
                  native_token: {
                    denom: 'uluna',
                  },
                },
              },
              belief_price: $.beliefPrice,
              max_spread: $.maxSpread,
            },
          } as terraswap.pair.Swap<Luna>,
          $.buyAmount + 'uluna',
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

      if (!fromContract) {
        return helper.failedToFindEvents('wasm');
      }

      try {
        const return_amount = pickAttributeValueByKey<u<Token>>(
          fromContract,
          'return_amount',
        );
        const offer_amount = pickAttributeValueByKey<u<Luna>>(
          fromContract,
          'offer_amount',
        );
        const spread_amount = pickAttributeValueByKey<u<Token>>(
          fromContract,
          'spread_amount',
        );
        const commission_amount = pickAttributeValueByKey<u<Token>>(
          fromContract,
          'commission_amount',
        );

        const pricePerToken =
          return_amount && offer_amount
            ? (big(offer_amount).div(return_amount) as Luna<Big>)
            : undefined;
        const tradingFee =
          spread_amount && commission_amount
            ? (big(spread_amount).plus(commission_amount) as u<Token<Big>>)
            : undefined;
        const txFee = offer_amount
          ? (big($.fixedFee).plus(
              min(big(offer_amount).mul($.taxRate), $.maxTaxUUSD),
            ) as u<Luna<Big>>)
          : undefined;

        return {
          value: null,

          phase: TxStreamPhase.SUCCEED,
          receipts: [
            return_amount && {
              name: 'Tokens Bought',
              value: `${formatUTokenWithPostfixUnits(return_amount)} ${
                $.tokenSymbol
              }`,
            },
            offer_amount && {
              name: 'Luna Paid',
              value: `${formatUTokenWithPostfixUnits(offer_amount)} Luna`,
            },
            pricePerToken && {
              name: `Price Per ${$.tokenSymbol}`,
              value: `${formatTokenWithPostfixUnits(pricePerToken)} Luna`,
            },
            tradingFee && {
              name: 'Trading Fee',
              value: `${formatUTokenWithPostfixUnits(tradingFee)} ${
                $.tokenSymbol
              }`,
            },
            helper.txHashReceipt(),
            helper.txFeeReceipt(txFee),
          ],
        } as TxResultRendering;
      } catch (error) {
        return helper.failedToParseTxResult();
      }
    },
  )().pipe(_catchTxError({ helper, ...$ }));
}
