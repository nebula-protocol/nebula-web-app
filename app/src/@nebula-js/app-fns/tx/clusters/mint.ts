import { floor } from '@libs/big-math';
import {
  pickAttributeValueByKey,
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
  HumanAddr,
  incentives,
  terraswap,
  Token,
  u,
} from '@nebula-js/types';
import { pipe } from '@rx-stream/pipe';
import { Coin, Coins, MsgExecuteContract, Fee } from '@terra-money/terra.js';
import big from 'big.js';
import { Observable } from 'rxjs';
import { formatUTokenWithPostfixUnits } from '@libs/formatter';

export function clusterMintTx(
  $: {
    walletAddr: HumanAddr;
    incentivesAddr: HumanAddr;
    clusterAddr: HumanAddr;
    assets: terraswap.Asset<Token>[];
    amounts: u<Token>[];
    tokenSymbol: string;
    onTxSucceed?: () => void;
  } & TxCommonParams,
): Observable<TxResultRendering> {
  const helper = new TxHelper($);

  const amounts = $.amounts.map((n) => floor(n).toFixed());

  const increaseAllownance = $.assets
    .map(({ info }, i) => {
      if ('token' in info && big(amounts[i]).gt(0)) {
        return new MsgExecuteContract($.walletAddr, info.token.contract_addr, {
          increase_allowance: {
            spender: $.incentivesAddr,
            amount: amounts[i],
          },
        } as cw20.IncreaseAllowance);
      } else {
        return undefined;
      }
    })
    .filter((contract): contract is MsgExecuteContract => !!contract);

  const nativeCoins = $.assets
    .map(({ info }, i) => {
      if ('native_token' in info && big(amounts[i]).gt(0)) {
        return new Coin(info.native_token.denom, amounts[i]);
      } else {
        return undefined;
      }
    })
    .filter((coin): coin is Coin => !!coin);

  return pipe(
    _createTxOptions({
      msgs: [
        ...increaseAllownance,
        new MsgExecuteContract(
          $.walletAddr,
          $.incentivesAddr,
          {
            incentives_create: {
              cluster_contract: $.clusterAddr,
              asset_amounts: $.assets
                .map(({ info }, i) => ({
                  info,
                  amount: amounts[i],
                }))
                .filter(({ amount }) => big(amount).gt(0)),
            },
          } as incentives.IncentivesCreate,
          nativeCoins.length > 0 ? new Coins(nativeCoins) : undefined,
        ),
      ],
      fee: new Fee($.gasWanted, floor($.txFee) + 'uusd'),
      gasAdjustment: $.gasAdjustment + 0.1,
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
        const mint_to_sender = pickAttributeValueByKey<u<Token>>(
          fromContract,
          'mint_to_sender',
        );

        return {
          value: null,

          phase: TxStreamPhase.SUCCEED,
          receipts: [
            mint_to_sender && {
              name: `Minted ${$.tokenSymbol}`,
              value: `${formatUTokenWithPostfixUnits(mint_to_sender)} ${
                $.tokenSymbol
              }`,
            },
            helper.txHashReceipt(),
            helper.txFeeReceipt($.txFee),
          ],
        } as TxResultRendering;
      } catch (error) {
        return helper.failedToParseTxResult();
      }
    },
  )().pipe(_catchTxError({ helper, ...$ }));
}
