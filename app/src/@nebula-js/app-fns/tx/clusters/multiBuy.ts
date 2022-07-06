import { floor } from '@libs/big-math';
import { formatUTokenWithPostfixUnits } from '@libs/formatter';
import {
  CW20Addr,
  HumanAddr,
  Rate,
  terraswap,
  Token,
  u,
  Luna,
} from '@libs/types';
import { pipe } from '@rx-stream/pipe';
import {
  MsgExecuteContract,
  MsgSwap,
  Fee,
  Coin,
  Msg,
} from '@terra-money/terra.js';
import big, { Big } from 'big.js';
import { Observable } from 'rxjs';
import { RawLogEvent, TxResultRendering, TxStreamPhase } from '@libs/app-fns';
import {
  pickAttributeValueByKey,
  pickEvent,
  pickRawLog,
  TxCommonParams,
} from '@libs/app-fns';
import {
  _catchTxError,
  _createTxOptions,
  _pollTxInfo,
  _postTx,
  TxHelper,
} from '@libs/app-fns/tx/internal';
import { SwapTokenInfo } from '@nebula-js/app-fns';

export function cw20MultiBuyTokensTx(
  $: {
    buyerAddr: HumanAddr;
    buyTokens: SwapTokenInfo[];
    onSwapSucceed: (value: u<Token>[]) => void;
    aUSTTokenAddr: CW20Addr;
    ancMarketContractAddr: HumanAddr;
    /** = slippage_tolerance */
    maxSpread: Rate;
    onTxSucceed?: () => void;
  } & TxCommonParams,
): Observable<TxResultRendering> {
  const helper = new TxHelper($);

  const lunaIndex = $.buyTokens.findIndex(
    ({ info }) => 'native_token' in info && info.native_token.denom === 'uluna',
  );

  const buyTokensWithoutLuna = $.buyTokens.filter(
    (_, idx) => idx !== lunaIndex,
  );

  return pipe(
    _createTxOptions({
      msgs: buyTokensWithoutLuna.reduce<Msg[]>(
        (acc, { tokenUstPairAddr, buyUlunaAmount, beliefPrice, info }) => {
          if ('token' in info && info.token.contract_addr === $.aUSTTokenAddr) {
            return [
              ...acc,
              new MsgExecuteContract(
                $.buyerAddr,
                $.ancMarketContractAddr,
                {
                  deposit_stable: {},
                },
                buyUlunaAmount + 'uluna',
              ),
            ];
          }

          if ('native_token' in info) {
            return [
              ...acc,
              new MsgSwap(
                $.buyerAddr,
                new Coin('uluna', buyUlunaAmount),
                info.native_token.denom,
              ),
            ];
          }

          return [
            ...acc,
            new MsgExecuteContract(
              $.buyerAddr,
              tokenUstPairAddr!,
              {
                swap: {
                  offer_asset: {
                    amount: buyUlunaAmount,
                    info: {
                      native_token: {
                        denom: 'uluna',
                      },
                    },
                  },
                  belief_price: beliefPrice,
                  max_spread: $.maxSpread,
                },
              } as terraswap.pair.Swap<Luna>,
              buyUlunaAmount + 'uluna',
            ),
          ];
        },
        [],
      ),
      fee: new Fee($.gasWanted, floor($.txFee) + 'uluna'),
      gasAdjustment: $.gasAdjustment,
    }),
    _postTx({ helper, ...$ }),
    _pollTxInfo({ helper, ...$ }),
    ({ value: txInfo }) => {
      let events: RawLogEvent[] = [];
      let returnAmounts: u<Token>[] = [];
      let totalOfferAmount = big(0) as u<Luna<Big>>;

      buyTokensWithoutLuna.forEach(({ info }, idx) => {
        const rawLog = pickRawLog(txInfo, idx);

        if (!rawLog) {
          return helper.failedToFindRawLog();
        }

        if ('native_token' in info) {
          const swap = pickEvent(rawLog, 'swap');

          if (!swap) {
            return helper.failedToFindEvents('wasm');
          }

          events[idx] = swap;
        } else {
          const fromContract = pickEvent(rawLog, 'wasm');

          if (!fromContract) {
            return helper.failedToFindEvents('wasm');
          }
          events[idx] = fromContract;
        }
      });

      try {
        events.forEach((event) => {
          // Astroport pool (token addr)
          const return_amount = pickAttributeValueByKey<u<Token>>(
            event,
            'return_amount',
          );
          const offer_amount = pickAttributeValueByKey<u<Luna>>(
            event,
            'offer_amount',
          );

          // Anchor (aUST)
          const mint_amount = pickAttributeValueByKey<u<Token>>(
            event,
            'mint_amount',
          );
          const deposit_amount = pickAttributeValueByKey<u<Luna>>(
            event,
            'deposit_amount',
          );

          // Native Token
          const offer_swap = pickAttributeValueByKey<u<Luna>>(event, 'offer');
          const return_swap = pickAttributeValueByKey<u<Token>>(
            event,
            'swap_coin',
          );

          if (return_amount !== undefined && offer_amount !== undefined) {
            returnAmounts.push(return_amount);
            totalOfferAmount = totalOfferAmount.add(offer_amount) as u<
              Luna<Big>
            >;
          } else if (
            mint_amount !== undefined &&
            deposit_amount !== undefined
          ) {
            returnAmounts.push(mint_amount);
            totalOfferAmount = totalOfferAmount.add(deposit_amount) as u<
              Luna<Big>
            >;
          } else if (offer_swap !== undefined && return_swap !== undefined) {
            returnAmounts.push(
              Coin.fromString(return_swap).amount.toString() as u<Token>,
            );
            totalOfferAmount = totalOfferAmount.add(
              Coin.fromString(offer_swap).amount.toString(),
            ) as u<Luna<Big>>;
          } else {
            throw Error(
              "Can't get return_amount or offer_amount or mint_amount or deposit_amount or offer_swap or return_swap",
            );
          }
        });

        if (lunaIndex === 0) {
          returnAmounts = [
            $.buyTokens[lunaIndex].buyUlunaAmount,
            ...returnAmounts,
          ];
        } else if (lunaIndex > 0) {
          returnAmounts = [
            ...returnAmounts.slice(0, lunaIndex),
            $.buyTokens[lunaIndex].buyUlunaAmount,
            ...returnAmounts.slice(lunaIndex),
          ];
        }

        console.log('returnAmounts', returnAmounts);

        // save to mint basic context
        $.onSwapSucceed(returnAmounts);

        return {
          value: null,

          phase: TxStreamPhase.SUCCEED,
          receipts: [
            totalOfferAmount && {
              name: 'Paid',
              value: `${formatUTokenWithPostfixUnits(totalOfferAmount)} Luna`,
            },
            helper.txHashReceipt(),
            helper.txFeeReceipt($.txFee),
          ],
        } as TxResultRendering;
      } catch (error) {
        console.error(error);
        return helper.failedToParseTxResult();
      }
    },
  )().pipe(_catchTxError({ helper, ...$ }));
}
