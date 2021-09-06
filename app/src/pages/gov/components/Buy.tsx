import {
  formatFluidDecimalPoints,
  formatUInput,
  formatUToken,
  microfy,
} from '@libs/formatter';
import { useCW20BuyTokenForm, useCW20BuyTokenTx } from '@libs/webapp-provider';
import { ArrowSouthIcon, WalletIcon } from '@nebula-js/icons';
import { NEB, Rate, u, UST } from '@nebula-js/types';
import {
  breakpoints,
  Button,
  Disclosure,
  EmptyButton,
  FormLabel,
  IconSeparator,
  TokenInput,
  TokenSpan,
  useConfirm,
  useScreenSizeValue,
} from '@nebula-js/ui';
import { useNebulaWebapp } from '@nebula-js/webapp-provider';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import big, { BigSource } from 'big.js';
import { FeeBox } from 'components/boxes/FeeBox';
import { WarningMessageBox } from 'components/boxes/WarningMessageBox';
import { SlippageToleranceInput } from 'components/form/SlippageToleranceInput';
import { ExchangeRateAB } from 'components/text/ExchangeRateAB';
import { useTxBroadcast } from 'contexts/tx-broadcast';
import { fixHMR } from 'fix-hmr';
import React, { useCallback, useState } from 'react';
import styled from 'styled-components';

export interface BuyProps {
  className?: string;
}

function BuyBase({ className }: BuyProps) {
  const connectedWallet = useConnectedWallet();

  const { broadcast } = useTxBroadcast();

  const [openConfirm, confirmElement] = useConfirm();

  const [openMoreOptions, setOpenMoreOptions] = useState<boolean>(false);

  const { contractAddress } = useNebulaWebapp();

  const postTx = useCW20BuyTokenTx(contractAddress.terraswap.nebUstPair, 'NEB');

  const [updateInput, states] = useCW20BuyTokenForm<NEB>({
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
    async (
      ustAmount: UST,
      txFee: u<UST<BigSource>>,
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
        buyAmount: microfy(ustAmount).toFixed() as u<UST>,
        txFee: big(txFee).toFixed() as u<UST>,
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
        value={states.ustAmount ?? ('' as UST)}
        onChange={(nextUstAmount) =>
          updateInput({ ustAmount: nextUstAmount, tokenAmount: undefined })
        }
        placeholder="0.00"
        label="UST AMOUNT"
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
        value={states.tokenAmount ?? ('' as NEB)}
        onChange={(nextNebAmount) =>
          updateInput({ ustAmount: undefined, tokenAmount: nextNebAmount })
        }
        placeholder="0.00"
        label="NEB AMOUNT"
        token={<TokenSpan>NEB</TokenSpan>}
      />

      <Disclosure
        className="more-options"
        title="More Options"
        open={openMoreOptions}
        onChange={setOpenMoreOptions}
      >
        <FormLabel label="Max Spread">
          <SlippageToleranceInput
            initialCustomValue={'0.05' as Rate}
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
              symbolA="UST"
              symbolB="NEB"
              exchangeRateAB={states.beliefPrice}
              initialDirection="a/b"
              formatExchangeRate={(price) => formatFluidDecimalPoints(price, 6)}
            />
          </li>
        )}
        {'minimumReceived' in states && (
          <li>
            <span>Minimum Received</span>
            <span>{formatUToken(states.minimumReceived)} NEB</span>
          </li>
        )}
        {'tradingFee' in states && (
          <li>
            <span>Trading Fee</span>
            <span>{formatUToken(states.tradingFee)} NEB</span>
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
          proceed(
            states.ustAmount,
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

export const StyledBuy = styled(BuyBase)`
  font-size: 1rem;

  .more-options {
    margin-top: 2.14285714em;
  }

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

export const Buy = fixHMR(StyledBuy);
