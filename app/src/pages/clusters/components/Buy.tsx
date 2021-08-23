import { ArrowSouthIcon, WalletIcon } from '@nebula-js/icons';
import {
  formatFluidDecimalPoints,
  formatUInput,
  formatUToken,
  microfy,
} from '@libs/formatter';
import { CT, u, UST } from '@nebula-js/types';
import {
  Button,
  EmptyButton,
  IconSeparator,
  TokenInput,
  TokenSpan,
  useConfirm,
  useScreenSizeValue,
} from '@nebula-js/ui';
import { ClusterInfo } from '@nebula-js/webapp-fns';
import {
  useCW20BuyTokenForm,
  useCW20BuyTokenTx,
} from '@nebula-js/webapp-provider';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import big, { BigSource } from 'big.js';
import { FeeBox } from 'components/boxes/FeeBox';
import { WarningMessageBox } from 'components/boxes/WarningMessageBox';
import { ExchangeRateAB } from 'components/text/ExchangeRateAB';
import { useTxBroadcast } from 'contexts/tx-broadcast';
import React, { useCallback } from 'react';
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

  const postTx = useCW20BuyTokenTx(
    terraswapPair.contract_addr,
    clusterTokenInfo.symbol,
  );

  const [updateInput, states] = useCW20BuyTokenForm<CT>({
    ustTokenPairAddr: terraswapPair.contract_addr,
    tokenAddr: clusterState.cluster_token,
  });

  const initForm = useCallback(() => {
    updateInput({
      ustAmount: '' as UST,
      tokenAmount: '' as CT,
    });
  }, [updateInput]);

  const proceed = useCallback(
    async (
      ustAmount: UST,
      txFee: u<UST<BigSource>>,
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
        buyAmount: microfy(ustAmount).toFixed() as u<UST>,
        txFee: big(txFee).toFixed() as u<UST>,
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
        value={states.ustAmount ?? ('' as UST)}
        onChange={(nextUstAmount) =>
          updateInput({ ustAmount: nextUstAmount, tokenAmount: undefined })
        }
        placeholder="0.00"
        label="FROM"
        suggest={
          <EmptyButton
            onClick={() =>
              updateInput({
                ustAmount: formatUInput(states.maxUstAmount) as UST,
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
          </EmptyButton>
        }
        token={<TokenSpan>UST</TokenSpan>}
        error={states.invalidUstAmount}
      />

      <IconSeparator>
        <ArrowSouthIcon />
      </IconSeparator>

      <TokenInput
        maxDecimalPoints={6}
        value={states.tokenAmount ?? ('' as CT)}
        onChange={(nextCtAmount) =>
          updateInput({ ustAmount: undefined, tokenAmount: nextCtAmount })
        }
        placeholder="0.00"
        label="TO"
        token={<TokenSpan>{clusterTokenInfo.symbol}</TokenSpan>}
      />

      <FeeBox className="feebox">
        {'beliefPrice' in states && (
          <li>
            <span>Price</span>
            <ExchangeRateAB
              symbolA="UST"
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
            <span>{formatUToken(states.txFee)} UST</span>
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
          states.ustAmount &&
          'txFee' in states &&
          proceed(states.ustAmount, states.txFee, states.warningNextTxFee)
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
