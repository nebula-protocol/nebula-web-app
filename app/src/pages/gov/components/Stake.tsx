import { WalletIcon } from '@nebula-js/icons';
import { formatUInput, formatUToken, microfy } from '@libs/formatter';
import { NEB, u, UST } from '@nebula-js/types';
import {
  breakpoints,
  Button,
  EmptyButton,
  Slider,
  TokenInput,
  TokenSpan,
  useScreenSizeValue,
} from '@nebula-js/ui';
import { useGovStakeForm, useGovStakeTx } from '@nebula-js/webapp-provider';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import big, { BigSource } from 'big.js';
import { FeeBox } from 'components/boxes/FeeBox';
import { WarningMessageBox } from 'components/boxes/WarningMessageBox';
import { useTxBroadcast } from 'contexts/tx-broadcast';
import { fixHMR } from 'fix-hmr';
import React, { ChangeEvent, useCallback } from 'react';
import styled from 'styled-components';

export interface GovStakeProps {
  className?: string;
}

function GovStakeBase({ className }: GovStakeProps) {
  const connectedWallet = useConnectedWallet();

  const { broadcast } = useTxBroadcast();

  const postTx = useGovStakeTx();

  const [updateInput, states] = useGovStakeForm();

  const initForm = useCallback(() => {
    updateInput({
      nebAmount: '' as NEB,
      lockForWeeks: 0,
    });
  }, [updateInput]);

  const proceed = useCallback(
    async (nebAmount: NEB, lockForWeeks: number, txFee: u<UST<BigSource>>) => {
      const stream = postTx?.({
        nebAmount: microfy(nebAmount).toFixed() as u<NEB>,
        lockForWeeks,
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
        value={states.nebAmount ?? ('' as NEB)}
        onChange={(nextNebAmount) => updateInput({ nebAmount: nextNebAmount })}
        placeholder="0.00"
        label="AMOUNT"
        suggest={
          <EmptyButton
            onClick={() =>
              updateInput({
                nebAmount: formatUInput(states.maxNebAmount) as NEB,
              })
            }
          >
            <WalletIcon
              style={{
                transform: 'translateX(-0.3em)',
              }}
            />{' '}
            {formatUToken(states.maxNebAmount)}
          </EmptyButton>
        }
        token={<TokenSpan>NEB</TokenSpan>}
        error={states.invalidNebAmount}
      />

      {states.minLockForWeeks + 10 < states.maxLockForWeeks && (
        <>
          <TokenInput
            className="lockup-weeks"
            maxIntegerPoints={3}
            maxDecimalPoints={0}
            value={states.lockForWeeks.toString()}
            onChange={(nextLockForWeeks) => {
              if (nextLockForWeeks.length > 0) {
                updateInput({
                  lockForWeeks: Math.min(
                    +nextLockForWeeks,
                    states.maxLockForWeeks,
                  ),
                });
              } else {
                updateInput({ lockForWeeks: 0 });
              }
            }}
            placeholder="0"
            label="LOCK-UP WEEKS"
          />

          <Slider
            className="lockup-weeks-slider"
            value={states.lockForWeeks}
            min={0}
            max={states.maxLockForWeeks}
            marks={[
              {
                value: states.minLockForWeeks,
                label: `${states.minLockForWeeks} Week${
                  states.minLockForWeeks > 1 ? 's' : ''
                }`,
              },
              {
                value: states.maxLockForWeeks,
                label: `${Math.round(states.maxLockForWeeks / 52)} Years`,
              },
            ]}
            onChange={(
              _: ChangeEvent<{}>,
              nextLockForWeeks: number | number[],
            ) => {
              if (typeof nextLockForWeeks === 'number') {
                updateInput({ lockForWeeks: nextLockForWeeks });
              }
            }}
          />
        </>
      )}

      <FeeBox className="feebox">
        {states.stakedNebAfterTx && (
          <li>
            <span>Staked after Tx</span>
            <span>{formatUToken(states.stakedNebAfterTx)} NEB</span>
          </li>
        )}
        {states.txFee && (
          <li>
            <span>Tx Fee</span>
            <span>{formatUToken(states.txFee)} UST</span>
          </li>
        )}
      </FeeBox>

      {states.invalidTxFee && (
        <WarningMessageBox level="critical" className="warning">
          {states.invalidTxFee}
        </WarningMessageBox>
      )}

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
          states.nebAmount &&
          states.txFee &&
          proceed(states.nebAmount, states.lockForWeeks, states.txFee)
        }
      >
        Stake
      </Button>
    </div>
  );
}

export const StyledGovStake = styled(GovStakeBase)`
  font-size: 1rem;

  .lockup-weeks {
    margin-top: 2.28571429em;
  }

  .lockup-weeks-slider {
    margin-top: 3.57142857em;
  }

  .feebox {
    margin-top: 2.4em;
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
      margin-top: 2em;
    }

    .submit {
      margin-top: 2.2em;
    }
  }
`;

export const GovStake = fixHMR(StyledGovStake);
