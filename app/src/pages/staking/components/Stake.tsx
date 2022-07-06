import { formatUInput, formatUToken, microfy } from '@libs/formatter';
import { StakingPoolInfo } from '@nebula-js/app-fns';
import {
  useStakingStakeForm,
  useStakingStakeTx,
} from '@nebula-js/app-provider';
import { PlusIcon, WalletIcon } from '@nebula-js/icons';
import { CT, Rate, u, Luna } from '@nebula-js/types';
import {
  breakpoints,
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
import { useTxBroadcast } from 'contexts/tx-broadcast';
import React, { useCallback, useState } from 'react';
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

  const [openMoreOptions, setOpenMoreOptions] = useState<boolean>(false);

  const postTx = useStakingStakeTx(tokenAddr, terraswapPair.contract_addr);

  const [updateInput, states] = useStakingStakeForm({
    tokenAddr: tokenAddr,
    lunaTokenPairAddr: terraswapPair.contract_addr,
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
      tokenAmount: CT,
      txFee: u<Luna<BigSource>>,
      slippageTolerance: Rate,
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
        lunaAmount: microfy(lunaAmount).toFixed() as u<Luna>,
        tokenAmount: microfy(tokenAmount).toFixed() as u<CT>,
        txFee: big(txFee).toFixed() as u<Luna>,
        slippageTolerance,
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
        value={states.tokenAmount ?? ('' as CT)}
        onChange={(nextCtAmount) =>
          updateInput({ lunaAmount: undefined, tokenAmount: nextCtAmount })
        }
        placeholder="0.00"
        label="AMOUNT"
        suggest={
          <TextButton
            fontSize={12}
            onClick={() =>
              updateInput({
                lunaAmount: undefined,
                tokenAmount: formatUInput(states.maxTokenAmount) as CT,
              })
            }
          >
            <WalletIcon
              style={{
                transform: 'translateX(-0.3em)',
              }}
            />{' '}
            {formatUToken(states.maxTokenAmount)}
          </TextButton>
        }
        token={
          <TokenSpan symbol={tokenInfo.symbol}>{tokenInfo.symbol}</TokenSpan>
        }
        error={states.invalidTokenAmount}
      />

      <IconSeparator>
        <PlusIcon />
      </IconSeparator>

      <TokenInput
        maxDecimalPoints={6}
        value={states.lunaAmount ?? ('' as Luna)}
        onChange={(nextUstAmount) =>
          updateInput({ lunaAmount: nextUstAmount, tokenAmount: undefined })
        }
        placeholder="0.00"
        label="AMOUNT"
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

      <Disclosure
        className="more-options"
        title="More Options"
        open={openMoreOptions}
        onChange={setOpenMoreOptions}
      >
        <FormLabel label="Slippage Tolerance">
          <SlippageToleranceInput
            initialCustomValue={'0.1' as Rate}
            value={states.slippageTolerance}
            onChange={(nextSlippageTolerance) =>
              updateInput({ slippageTolerance: nextSlippageTolerance })
            }
          />
        </FormLabel>
      </Disclosure>

      <FeeBox className="feebox">
        {states.lpStakedFromTx && (
          <li>
            <span>LP Staked from Tx</span>
            <span>{formatUToken(states.lpStakedFromTx)} LP</span>
          </li>
        )}
        {states.txFee && (
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
          states.tokenAmount &&
          states.txFee &&
          proceed(
            states.lunaAmount,
            states.tokenAmount,
            states.txFee,
            states.slippageTolerance,
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
