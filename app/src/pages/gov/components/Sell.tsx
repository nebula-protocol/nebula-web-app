import { ArrowSouthIcon, WalletIcon } from '@nebula-js/icons';
import {
  formatFluidDecimalPoints,
  formatUInput,
  formatUToken,
  microfy,
} from '@libs/formatter';
import { NEB, u, UST } from '@nebula-js/types';
import {
  breakpoints,
  Button,
  EmptyButton,
  IconSeparator,
  TokenInput,
  TokenSpan,
  useScreenSizeValue,
} from '@nebula-js/ui';
import {
  useCW20SellTokenForm,
  useCW20SellTokenTx,
  useNebulaWebapp,
} from '@nebula-js/webapp-provider';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import big, { BigSource } from 'big.js';
import { FeeBox } from 'components/boxes/FeeBox';
import { WarningMessageBox } from 'components/boxes/WarningMessageBox';
import { ExchangeRateAB } from 'components/text/ExchangeRateAB';
import { useTxBroadcast } from 'contexts/tx-broadcast';
import { fixHMR } from 'fix-hmr';
import React, { useCallback } from 'react';
import styled from 'styled-components';

export interface SellProps {
  className?: string;
}

function SellBase({ className }: SellProps) {
  const connectedWallet = useConnectedWallet();

  const { broadcast } = useTxBroadcast();

  const { contractAddress } = useNebulaWebapp();

  const postTx = useCW20SellTokenTx(
    contractAddress.cw20.NEB,
    contractAddress.terraswap.nebUstPair,
    'NEB',
  );

  const [updateInput, states] = useCW20SellTokenForm<NEB>({
    tokenAddr: contractAddress.cw20.NEB,
    ustTokenPairAddr: contractAddress.terraswap.nebUstPair,
  });

  const initForm = useCallback(() => {
    updateInput({
      ustAmount: '' as UST,
      tokenAmount: '' as NEB,
    });
  }, [updateInput]);

  const proceed = useCallback(
    (tokenAmount: NEB, txFee: u<UST<BigSource>>) => {
      const stream = postTx?.({
        sellAmount: microfy(tokenAmount).toFixed() as u<UST>,
        txFee: big(txFee).toFixed() as u<UST>,
        onTxSucceed: initForm,
      });

      if (stream) {
        broadcast(stream);
      }
    },
    [broadcast, initForm, postTx],
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
        value={states.tokenAmount ?? ('' as NEB)}
        onChange={(nextTokenAmount) =>
          updateInput({ tokenAmount: nextTokenAmount, ustAmount: undefined })
        }
        placeholder="0.00"
        label="FROM"
        suggest={
          <EmptyButton
            onClick={() =>
              updateInput({
                tokenAmount: formatUInput(states.tokenBalance) as NEB,
                ustAmount: undefined,
              })
            }
          >
            <WalletIcon
              style={{
                transform: 'translateX(-0.3em)',
              }}
            />{' '}
            {formatUToken(states.tokenBalance)}
          </EmptyButton>
        }
        token={<TokenSpan>NEB</TokenSpan>}
        error={states.invalidTokenAmount}
      />

      <IconSeparator>
        <ArrowSouthIcon />
      </IconSeparator>

      <TokenInput
        maxDecimalPoints={6}
        value={states.ustAmount ?? ('' as UST)}
        onChange={(nextUstAmount) =>
          updateInput({ ustAmount: nextUstAmount, tokenAmount: undefined })
        }
        placeholder="0.00"
        label="TO"
        token={<TokenSpan>UST</TokenSpan>}
      />

      <FeeBox className="feebox">
        {'beliefPrice' in states && (
          <li>
            <span>Price</span>
            <ExchangeRateAB
              symbolA="NEB"
              symbolB="UST"
              exchangeRateAB={states.beliefPrice}
              initialDirection="b/a"
              formatExchangeRate={(price) => formatFluidDecimalPoints(price, 6)}
            />
          </li>
        )}
        {'minimumReceived' in states && (
          <li>
            <span>Minimum Received</span>
            <span>{formatUToken(states.minimumReceived)} UST</span>
          </li>
        )}
        {'tradingFee' in states && (
          <li>
            <span>Trading Fee</span>
            <span>{formatUToken(states.tradingFee)} UST</span>
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
          states.tokenAmount &&
          'txFee' in states &&
          proceed(states.tokenAmount, states.txFee)
        }
      >
        Sell
      </Button>
    </div>
  );
}

export const StyledSell = styled(SellBase)`
  font-size: 1rem;

  .feebox {
    margin-top: 2.8em;
  }

  .submit {
    display: block;
    width: 100%;
    max-width: 360px;
    margin: 2.8em auto 0 auto;
  }

  @media (max-width: ${breakpoints.mobile.max}px) {
    .feebox {
      font-size: 0.9em;
      margin-top: 2.2em;
    }

    .submit {
      margin-top: 2.2em;
    }
  }
`;

export const Sell = fixHMR(StyledSell);
