import { PlusIcon, WalletIcon } from '@nebula-js/icons';
import { NEB, UST } from '@nebula-js/types';
import {
  breakpoints,
  Button,
  EmptyButton,
  IconSeparator,
  TokenInput,
  TokenSpan,
  useScreenSizeValue,
} from '@nebula-js/ui';
import { FeeBox } from 'components/boxes/FeeBox';
import React, { useState } from 'react';
import styled from 'styled-components';

export interface StakingStakeProps {
  className?: string;
}

function StakingStakeBase({ className }: StakingStakeProps) {
  const [fromAmount, setFromAmount] = useState<UST>('' as UST);
  const [toAmount, setToAmount] = useState<NEB>('' as NEB);

  const buttonSize = useScreenSizeValue<'normal' | 'medium'>({
    mobile: 'medium',
    tablet: 'normal',
    pc: 'normal',
    monitor: 'normal',
  });

  return (
    <div className={className}>
      <TokenInput
        value={fromAmount}
        onChange={setFromAmount}
        placeholder="0.00"
        label="FROM"
        suggest={
          <EmptyButton onClick={() => setFromAmount('1490' as UST)}>
            <WalletIcon
              style={{
                transform: 'translateX(-0.3em)',
              }}
            />{' '}
            1,490.000000
          </EmptyButton>
        }
        token={<TokenSpan>UST</TokenSpan>}
      />

      <IconSeparator>
        <PlusIcon />
      </IconSeparator>

      <TokenInput
        value={toAmount}
        onChange={setToAmount}
        placeholder="0.00"
        label="TO"
        suggest={
          <EmptyButton onClick={() => setToAmount('1490' as NEB)}>
            <WalletIcon
              style={{
                transform: 'translateX(-0.3em)',
              }}
            />{' '}
            1,490.000000
          </EmptyButton>
        }
        token={<TokenSpan>NEB</TokenSpan>}
      />

      <FeeBox className="feebox">
        <li>
          <span>Price</span>
          <span>1.555555 UST</span>
        </li>
        <li>
          <span>LP Staked from Tx</span>
          <span>23.321 LP</span>
        </li>
        <li>
          <span>Tx Fee</span>
          <span>0.014072 UST</span>
        </li>
      </FeeBox>

      <Button className="submit" color="paleblue" size={buttonSize}>
        Stake
      </Button>
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
