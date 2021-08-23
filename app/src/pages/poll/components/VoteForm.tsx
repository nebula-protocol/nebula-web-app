import { WalletIcon } from '@nebula-js/icons';
import { formatUToken, microfy } from '@libs/formatter';
import { gov, NEB, u } from '@nebula-js/types';
import {
  breakpoints,
  Button,
  EmptyButton,
  TokenInput,
  TokenSpan,
  useScreenSizeValue,
} from '@nebula-js/ui';
import { NebulaTokenBalances } from '@nebula-js/webapp-fns';
import { useGovVoteTx } from '@nebula-js/webapp-provider/tx/gov/vote';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useBank } from '@libs/webapp-provider';
import { useTxBroadcast } from 'contexts/tx-broadcast';
import { fixHMR } from 'fix-hmr';
import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import VoteOption = gov.VoteOption;

export interface VoteFormProps {
  className?: string;
  pollId: number;
  onVoteComplete: () => void;
}

function VoteFormBase({ className, pollId, onVoteComplete }: VoteFormProps) {
  const connectedWallet = useConnectedWallet();

  const { broadcast } = useTxBroadcast();

  const postTx = useGovVoteTx(pollId);

  const [vote, setVote] = useState<gov.VoteOption | null>(null);
  const [amount, setAmount] = useState<NEB>('' as NEB);

  const { tokenBalances } = useBank<NebulaTokenBalances>();

  const buttonSize = useScreenSizeValue<'normal' | 'medium'>({
    mobile: 'medium',
    tablet: 'normal',
    pc: 'normal',
    monitor: 'normal',
  });

  const proceed = useCallback(
    async (_vote: VoteOption, _amount: NEB) => {
      const stream = postTx?.({
        vote: _vote,
        amount: microfy(_amount).toFixed() as u<NEB>,
        onTxSucceed: onVoteComplete,
      });

      if (stream) {
        broadcast(stream);
      }
    },
    [broadcast, onVoteComplete, postTx],
  );

  return (
    <div className={className}>
      <section className="buttons">
        <Button
          size="normal"
          color="border"
          onClick={() => setVote(VoteOption.Yes)}
          aria-selected={vote === VoteOption.Yes}
        >
          YES
        </Button>
        <Button
          size="normal"
          color="border"
          onClick={() => setVote(VoteOption.No)}
          aria-selected={vote === VoteOption.No}
        >
          NO
        </Button>
        <Button
          size="normal"
          color="border"
          onClick={() => setVote(VoteOption.Abstain)}
          aria-selected={vote === VoteOption.Abstain}
        >
          Abstain
        </Button>
      </section>

      <TokenInput
        value={amount}
        onChange={setAmount}
        label="AMOUNT"
        placeholder="0.00"
        token={<TokenSpan>NEB</TokenSpan>}
        suggest={
          <EmptyButton onClick={() => setAmount(tokenBalances.uNEB)}>
            <WalletIcon
              style={{
                transform: 'translate(-0.3em, -0.1em)',
              }}
            />{' '}
            {formatUToken(tokenBalances.uNEB)}
          </EmptyButton>
        }
      />

      <Button
        size={buttonSize}
        color="paleblue"
        fullWidth
        disabled={
          !vote ||
          amount.length === 0 ||
          !postTx ||
          !connectedWallet ||
          !connectedWallet.availablePost
        }
        onClick={() => vote && proceed(vote, amount)}
      >
        Vote
      </Button>
    </div>
  );
}

export const StyledVoteForm = styled(VoteFormBase)`
  background-color: var(--color-gray14);
  padding: 20px 20px 40px 20px;
  border-radius: 8px;

  .buttons {
    display: flex;
    gap: 24px;

    > button {
      flex: 1;

      height: 96px;

      font-weight: 400;

      &[aria-selected='true'] {
        color: var(--color-paleblue);
        border-color: var(--color-paleblue);
      }
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
