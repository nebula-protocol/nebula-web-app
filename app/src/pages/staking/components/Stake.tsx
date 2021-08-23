import { PlusIcon, WalletIcon } from '@nebula-js/icons';
import {
  formatFluidDecimalPoints,
  formatUInput,
  formatUToken,
  microfy,
} from '@libs/formatter';
import { CT, u, UST } from '@nebula-js/types';
import {
  breakpoints,
  Button,
  EmptyButton,
  IconSeparator,
  TokenInput,
  TokenSpan,
  useConfirm,
  useScreenSizeValue,
} from '@nebula-js/ui';
import { StakingPoolInfo } from '@nebula-js/webapp-fns';
import {
  useStakingStakeForm,
  useStakingStakeTx,
} from '@nebula-js/webapp-provider';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import big, { BigSource } from 'big.js';
import { FeeBox } from 'components/boxes/FeeBox';
import { WarningMessageBox } from 'components/boxes/WarningMessageBox';
import { ExchangeRateAB } from 'components/text/ExchangeRateAB';
import { useTxBroadcast } from 'contexts/tx-broadcast';
import React, { useCallback } from 'react';
import styled from 'styled-components';

export interface StakingStakeProps {
  className?: string;
  poolInfo: StakingPoolInfo;
}

function StakingStakeBase({
  className,
  poolInfo: { tokenAddr, tokenInfo, terraswapPair },
}: StakingStakeProps) {
  const connectedWallet = useConnectedWallet();

  const { broadcast } = useTxBroadcast();

  const [openConfirm, confirmElement] = useConfirm();

  const postTx = useStakingStakeTx(tokenAddr, terraswapPair.contract_addr);

  const [updateInput, states] = useStakingStakeForm({
    tokenAddr: tokenAddr,
    ustTokenPairAddr: terraswapPair.contract_addr,
  });

  const initForm = useCallback(() => {
    updateInput({
      ustAmount: '' as UST,
    });
  }, [updateInput]);

  const proceed = useCallback(
    async (
      ustAmount: UST,
      tokenAmount: CT,
      txFee: u<UST<BigSource>>,
      warning: string | null,
    ) => {
      if (warning) {
        const confirm = await openConfirm({
          description: warning,
          agree: 'Stake',
          disagree: 'Cancel',
        });

        if (!confirm) {
          return;
        }
      }

      const stream = postTx?.({
        ustAmount: microfy(ustAmount).toFixed() as u<UST>,
        tokenAmount: microfy(tokenAmount).toFixed() as u<CT>,
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
        label="AMOUNT"
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
        <PlusIcon />
      </IconSeparator>

      <TokenInput
        maxDecimalPoints={6}
        value={states.tokenAmount ?? ('' as CT)}
        onChange={(nextCtAmount) =>
          updateInput({ ustAmount: undefined, tokenAmount: nextCtAmount })
        }
        placeholder="0.00"
        label="AMOUNT"
        suggest={
          <EmptyButton
            onClick={() =>
              updateInput({
                ustAmount: undefined,
                tokenAmount: states.maxTokenAmount,
              })
            }
          >
            <WalletIcon
              style={{
                transform: 'translateX(-0.3em)',
              }}
            />{' '}
            {formatUToken(states.maxTokenAmount)}
          </EmptyButton>
        }
        token={<TokenSpan>{tokenInfo.symbol}</TokenSpan>}
        error={states.invalidTokenAmount}
      />

      <FeeBox className="feebox">
        {states.poolPrice && (
          <li>
            <span>Price</span>
            <ExchangeRateAB
              symbolA="UST"
              symbolB={tokenInfo.symbol}
              exchangeRateAB={states.poolPrice}
              initialDirection="b/a"
              formatExchangeRate={(price) => formatFluidDecimalPoints(price, 6)}
            />
          </li>
        )}
        {states.lpStakedFromTx && (
          <li>
            <span>LP Staked from Tx</span>
            <span>{formatUToken(states.lpStakedFromTx)} LP</span>
          </li>
        )}
        {states.txFee && (
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
          states.tokenAmount &&
          states.txFee &&
          proceed(
            states.ustAmount,
            states.tokenAmount,
            states.txFee,
            states.warningNextTxFee,
          )
        }
      >
        Stake
      </Button>

      {confirmElement}
    </div>
  );
}

export const StakingStake = styled(StakingStakeBase)`
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
