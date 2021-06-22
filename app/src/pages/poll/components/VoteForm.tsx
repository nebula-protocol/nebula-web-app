import { WalletIcon } from '@nebula-js/icons';
import { NEB } from '@nebula-js/types';
import {
  breakpoints,
  Button,
  EmptyButton,
  TokenInput,
  TokenSpan,
  useScreenSizeValue,
} from '@nebula-js/ui';
import { fixHMR } from 'fix-hmr';
import React, { useState } from 'react';
import styled from 'styled-components';

export interface VoteFormProps {
  className?: string;
}

function VoteFormBase({ className }: VoteFormProps) {
  const [amount, setAmount] = useState<NEB>('' as NEB);

  const buttonSize = useScreenSizeValue<'normal' | 'medium'>({
    mobile: 'medium',
    tablet: 'normal',
    pc: 'normal',
    monitor: 'normal',
  });

  return (
    <div className={className}>
      <section className="buttons">
        <Button size="normal" color="border">
          YES
        </Button>
        <Button size="normal" color="border">
          NO
        </Button>
        <Button size="normal" color="border">
          Abstain
        </Button>
      </section>

      <TokenInput
        value={amount}
        onChange={setAmount}
        label="AMOUNT"
        placeholder="0.000000"
        token={<TokenSpan>NEB</TokenSpan>}
        suggest={
          <EmptyButton onClick={() => setAmount('100000' as NEB)}>
            <WalletIcon
              style={{
                transform: 'translate(-0.3em, -0.1em)',
              }}
            />{' '}
            2,000.000000
          </EmptyButton>
        }
      />

      <Button size={buttonSize} color="paleblue" fullWidth>
        Vote
      </Button>
    </div>
  );
}

export const StyledVoteForm = styled(VoteFormBase)`
  background-color: ${({ theme }) => theme.colors.gray14};
  padding: 20px 20px 40px 20px;
  border-radius: 8px;

  .buttons {
    display: flex;
    gap: 24px;

    > button {
      flex: 1;

      height: 96px;

      font-weight: 300;
    }

    margin-bottom: 32px;
  }

  > button {
    display: block;
    margin: 40px auto 0 auto;
    max-width: 360px;
  }

  // small layout
  @media (max-width: ${breakpoints.tablet.max}px) {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    margin-left: calc(var(--section-padding-h) * -1);
    margin-right: calc(var(--section-padding-h) * -1);
    margin-bottom: calc(var(--section-padding-v) * -1);

    .buttons {
      gap: 12px;

      > button {
        height: 72px;
        font-size: 1rem;
      }

      margin-bottom: 24px;
    }

    > button {
      margin-top: 24px;
    }
  }
`;

export const VoteForm = fixHMR(StyledVoteForm);
