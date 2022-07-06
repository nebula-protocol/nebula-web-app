import { useCW20BuyTokenForm, useCW20BuyTokenTx } from '@libs/app-provider';
import {
  formatFluidDecimalPoints,
  formatUInput,
  formatUToken,
  microfy,
} from '@libs/formatter';
import { ClusterInfo } from '@nebula-js/app-fns';
import { ArrowSouthIcon, WalletIcon } from '@nebula-js/icons';
import { CT, Rate, u, Luna } from '@nebula-js/types';
import {
  Button,
  Disclosure,
  FormLabel,
  IconSeparator,
  TextButton,
  TokenInput,
  TokenSpan,
  useConfirm,
  useScreenSizeValue,
} from '@nebula-js/ui';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import big, { BigSource } from 'big.js';
import { FeeBox } from 'components/boxes/FeeBox';
import { WarningMessageBox } from 'components/boxes/WarningMessageBox';
import { SlippageToleranceInput } from 'components/form/SlippageToleranceInput';
import { ExchangeRateAB } from 'components/text/ExchangeRateAB';
import { useTxBroadcast } from 'contexts/tx-broadcast';
import React, { useCallback, useState } from 'react';
import styled from 'styled-components';

export interface ClusterBuyProps {
  className?: string;
  clusterInfo: ClusterInfo;
}

function ClusterBuyBase({
  className,
  clusterInfo: { clusterState, terraswapPair, clusterTokenInfo },
}: ClusterBuyProps) {
  const connectedWallet = useConnectedWallet();

  const { broadcast } = useTxBroadcast();

  const [openConfirm, confirmElement] = useConfirm();

  const [openMoreOptions, setOpenMoreOptions] = useState<boolean>(false);

  const postTx = useCW20BuyTokenTx(
    terraswapPair.contract_addr,
    clusterTokenInfo.symbol,
  );

  const [updateInput, states] = useCW20BuyTokenForm<CT>({
    lunaTokenPairAddr: terraswapPair.contract_addr,
    tokenAddr: clusterState.cluster_token,
  });

  const initForm = useCallback(() => {
    updateInput({
      lunaAmount: '' as Luna,
      tokenAmount: '' as CT,
    });
  }, [updateInput]);

  const proceed = useCallback(
    async (
      lunaAmount: Luna,
      txFee: u<Luna<BigSource>>,
      maxSpread: Rate,
      warning: string | null,
    ) => {
      if (warning) {
        const confirm = await openConfirm({
          description: warning,
          agree: 'Buy',
          disagree: 'Cancel',
        });

        if (!confirm) {
          return;
        }
      }

      const stream = postTx?.({
        buyAmount: microfy(lunaAmount).toFixed() as u<Luna>,
        txFee: big(txFee).toFixed() as u<Luna>,
        maxSpread,
        onTxSucceed: initForm,
      });

      if (stream) {
        broadcast(stream);
      }
    },
    [broadcast, initForm, openConfirm, postTx],
  );

  // ---------------------------------------------
  // presentation
  // ---------------------------------------------
  const buttonSize = useScreenSizeValue<'normal' | 'medium'>({
    mobile: 'medium',
    tablet: 'normal',
    pc: 'normal',
    monitor: 'normal',
  });

  return (
    <div className={className}>
      <TokenInput
        maxDecimalPoints={6}
        value={states.lunaAmount ?? ('' as Luna)}
        onChange={(nextUstAmount) =>
          updateInput({ lunaAmount: nextUstAmount, tokenAmount: undefined })
        }
        placeholder="0.00"
        label="FROM"
        suggest={
          <TextButton
            fontSize={12}
            onClick={() =>
              updateInput({
                lunaAmount: formatUInput(states.maxUstAmount) as Luna,
                tokenAmount: undefined,
              })
            }
          >
            <WalletIcon
              style={{
                transform: 'translateX(-0.3em)',
              }}
            />{' '}
            {formatUToken(states.maxUstAmount)}
          </TextButton>
        }
        token={<TokenSpan symbol="Luna">Luna</TokenSpan>}
        error={states.invalidUstAmount}
      />

      <IconSeparator>
        <ArrowSouthIcon />
      </IconSeparator>

      <TokenInput
        maxDecimalPoints={6}
        value={states.tokenAmount ?? ('' as CT)}
        onChange={(nextCtAmount) =>
          updateInput({ lunaAmount: undefined, tokenAmount: nextCtAmount })
        }
        placeholder="0.00"
        label="TO"
        token={
          <TokenSpan symbol={clusterTokenInfo.symbol}>
            {clusterTokenInfo.symbol}
          </TokenSpan>
        }
      />

      <Disclosure
        className="more-options"
        title="More Options"
        open={openMoreOptions}
        onChange={setOpenMoreOptions}
      >
        <FormLabel label="Max Spread">
          <SlippageToleranceInput
            initialCustomValue={'0.1' as Rate}
            value={states.maxSpread}
            onChange={(nextMaxSpread) =>
              updateInput({ maxSpread: nextMaxSpread })
            }
          />
        </FormLabel>
      </Disclosure>

      <FeeBox className="feebox">
        {'beliefPrice' in states && (
          <li>
            <span>Price</span>
            <ExchangeRateAB
              symbolA="Luna"
              symbolB={clusterTokenInfo.symbol}
              exchangeRateAB={states.beliefPrice}
              initialDirection="a/b"
              formatExchangeRate={(price) => formatFluidDecimalPoints(price, 6)}
            />
          </li>
        )}
        {'minimumReceived' in states && (
          <li>
            <span>Minimum Received</span>
            <span>
              {formatUToken(states.minimumReceived)} {clusterTokenInfo.symbol}
            </span>
          </li>
        )}
        {'tradingFee' in states && (
          <li>
            <span>Trading Fee</span>
            <span>
              {formatUToken(states.tradingFee)} {clusterTokenInfo.symbol}
            </span>
          </li>
        )}
        {'txFee' in states && (
          <li>
            <span>Tx Fee</span>
            <span>{formatUToken(states.txFee)} Luna</span>
          </li>
        )}
      </FeeBox>

      {states.invalidTxFee ? (
        <WarningMessageBox level="critical" className="warning">
          {states.invalidTxFee}
        </WarningMessageBox>
      ) : states.warningNextTxFee ? (
        <WarningMessageBox level="warning" className="warning">
          {states.warningNextTxFee}
        </WarningMessageBox>
      ) : null}

      <Button
        className="submit"
        color="paleblue"
        size={buttonSize}
        disabled={
          !connectedWallet ||
          !connectedWallet.availablePost ||
          !postTx ||
          !states ||
          !states.availableTx
        }
        onClick={() =>
          states.lunaAmount &&
          'txFee' in states &&
          proceed(
            states.lunaAmount,
            states.txFee,
            states.maxSpread,
            states.warningNextTxFee,
          )
        }
      >
        Buy
      </Button>

      {confirmElement}
    </div>
  );
}

export const ClusterBuy = styled(ClusterBuyBase)`
  font-size: 1rem;

  .more-options {
    margin-top: 2.14285714em;
  }

  .feebox {
    margin-top: 2.14285714em;
  }

  .warning {
    margin-top: 2.14285714em;
  }

  .submit {
    display: block;
    width: 100%;
    max-width: 360px;
    margin: 2.14285714em auto 0 auto;
  }
`;
