import {
  formatTokenWithPostfixUnits,
  formatUTokenIntegerWithPostfixUnits,
} from '@nebula-js/notation';
import { HumanAddr, NativeDenom, Rate, Token, u, UST } from '@nebula-js/types';
import { pipe } from '@rx-stream/pipe';
import { floor, min } from '@terra-dev/big-math';
import { MsgExecuteContract, StdFee } from '@terra-money/terra.js';
import {
  pickAttributeValueByKey,
  pickEvent,
  pickRawLog,
  TxResultRendering,
  TxStreamPhase,
} from '@terra-money/webapp-fns';
import big, { Big } from 'big.js';
import { Observable } from 'rxjs';
import { NebulaTax } from '../../types';
import { _catchTxError } from '../internal/_catchTxError';
import { _createTxOptions } from '../internal/_createTxOptions';
import { _pollTxInfo } from '../internal/_pollTxInfo';
import { _postTx } from '../internal/_postTx';
import { TxHelper } from '../internal/TxHelper';
import { TxCommonParams } from '../TxCommonParams';

export function cw20BuyTokenTx(
  $: {
    buyerAddr: HumanAddr;
    buyAmount: u<UST>;
    tokenUstPairAddr: HumanAddr;
    tokenSymbol: string;
    beliefPrice: UST;
    maxSpread: Rate;
    tax: NebulaTax;
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
                    denom: 'uusd' as NativeDenom,
                  },
                },
              },
              belief_price: $.beliefPrice,
              // TODO restore max_spread
              //max_spread: $.maxSpread,
            },
          },
          $.buyAmount + 'uusd',
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

      if (!fromContract) {
        return helper.failedToFindEvents('from_contract');
      }

      try {
        const return_amount = pickAttributeValueByKey<u<Token>>(
          fromContract,
          'return_amount',
        );
        const offer_amount = pickAttributeValueByKey<u<UST>>(
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
            ? (big(return_amount).div(offer_amount) as UST<Big>)
            : undefined;
        const tradingFee =
          spread_amount && commission_amount
            ? (big(spread_amount).plus(commission_amount) as u<Token<Big>>)
            : undefined;
        const txFee = offer_amount
          ? (big($.fixedGas).plus(
              min(big(offer_amount).mul($.tax.taxRate), $.tax.maxTaxUUSD),
            ) as u<UST<Big>>)
          : undefined;

        return {
          value: null,

          phase: TxStreamPhase.SUCCEED,
          receipts: [
            return_amount && {
              name: 'Bought',
              value: `${formatUTokenIntegerWithPostfixUnits(return_amount)} ${
                $.tokenSymbol
              }`,
            },
            offer_amount && {
              name: 'Paid',
              value: `${formatUTokenIntegerWithPostfixUnits(offer_amount)} UST`,
            },
            pricePerToken && {
              name: 'Paid/Bought',
              value: `${formatTokenWithPostfixUnits(pricePerToken)} UST`,
            },
            tradingFee && {
              name: 'Trading Fee',
              value: `${formatUTokenIntegerWithPostfixUnits(tradingFee)} ${
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