import { formatUInput, formatUToken, microfy } from '@libs/formatter';
import { useGovStakeForm, useGovStakeTx } from '@nebula-js/app-provider';
import { WalletIcon } from '@nebula-js/icons';
import { NEB, u, Luna } from '@nebula-js/types';
import {
  breakpoints,
  Button,
  TextButton,
  TokenInput,
  TokenSpan,
  useScreenSizeValue,
} from '@nebula-js/ui';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import big, { BigSource } from 'big.js';
import { FeeBox } from 'components/boxes/FeeBox';
import { WarningMessageBox } from 'components/boxes/WarningMessageBox';
import { useTxBroadcast } from 'contexts/tx-broadcast';
import { fixHMR } from 'fix-hmr';
import React, { useCallback } from 'react';
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
    });
  }, [updateInput]);

  const proceed = useCallback(
    async (nebAmount: NEB, txFee: u<Luna<BigSource>>) => {
      const stream = postTx?.({
        nebAmount: microfy(nebAmount).toFixed() as u<NEB>,
        txFee: big(txFee).toFixed() as u<Luna>,
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
          <TextButton
            fontSize={12}
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
          </TextButton>
        }
        token={<TokenSpan symbol="NEB">NEB</TokenSpan>}
        error={states.invalidNebAmount}
      />

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
            <span>{formatUToken(states.txFee)} Luna</span>
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
          proceed(states.nebAmount, states.txFee)
        }
      >
        Stake
      </Button>
    </div>
  );
}

export const StyledGovStake = styled(GovStakeBase)`
  font-size: 1rem;

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
