import { formatUTokenWithPostfixUnits } from '@libs/formatter';
import { AnimateNumber } from '@libs/ui';
import { useGovStakerQuery, useNebBalance } from '@nebula-js/app-provider';
import { NEB, u } from '@nebula-js/types';
import {
  Button,
  IconAndLabels,
  Section,
  Sub,
  TitledLabel,
} from '@nebula-js/ui';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { fixHMR } from 'fix-hmr';
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

export interface NEBSectionProps {
  className?: string;
}

function NEBSectionBase({ className }: NEBSectionProps) {
  const connectedWallet = useConnectedWallet();

  const uNEB = useNebBalance(connectedWallet?.walletAddress);

  const { data: { govStaker } = {} } = useGovStakerQuery(
    connectedWallet?.walletAddress,
  );

  return (
    <Section className={className}>
      <IconAndLabels
        symbol="NEB"
        className="token"
        text="NEB"
        subtext="Nebula"
        subtextSize="0.6em"
        iconSize="1.8em"
        iconMarginRight="0.3em"
        textGap="-0.15em"
      />
      <div className="buttons">
        {/* <Button
          size="medium"
          componentProps={{ component: Link, to: '/gov/trade' }}
        >
          Trade
        </Button> */}
        <Button
          size="medium"
          componentProps={{ component: Link, to: '/gov/stake' }}
        >
          Stake
        </Button>
      </div>
      <section className="labels">
        <TitledLabel
          title="STAKED NEB"
          text={
            <>
              <AnimateNumber format={formatUTokenWithPostfixUnits}>
                {govStaker ? govStaker.balance : (0 as u<NEB<number>>)}
              </AnimateNumber>{' '}
              <Sub>NEB</Sub>
            </>
          }
        />
        <TitledLabel
          title="STAKABLE NEB"
          text={
            <>
              <AnimateNumber format={formatUTokenWithPostfixUnits}>
                {uNEB}
              </AnimateNumber>{' '}
              <Sub>NEB</Sub>
            </>
          }
        />
      </section>
    </Section>
  );
}

const StyledNEBSection = styled(NEBSectionBase)`
  min-height: 230px;

  background-color: var(--color-gray14);

  display: grid;
  grid-template-columns: auto auto;
  grid-template-rows: auto auto;

  .token {
    font-size: 24px;

    align-self: start;
  }

  .buttons {
    a {
      min-width: 120px;
      max-width: 120px;
    }

    justify-self: end;

    display: flex;
    justify-content: flex-end;
    gap: 1em;
  }

  .labels {
    font-size: 20px;

    align-self: end;

    display: flex;
    gap: 28px;
    grid-column: span 2;
  }

  .apr {
    justify-self: end;
    align-self: end;

    display: flex;
    gap: 12px;
    align-items: flex-end;

    > :first-child {
      font-size: 12px;
      color: var(--color-paleblue);

      border: 1px solid var(--color-paleblue);
      border-radius: 16px;
      padding: 4px 10px;

      transform: translateY(-4px);
    }

    > :last-child {
      font-size: 40px;
      line-height: 1em;
      max-height: 1em;
    }
  }

  @media (max-width: 1050px) {
    grid-template-columns: auto auto;
    grid-template-rows: auto auto auto;

    .token {
      font-size: 20px;

      grid-column: 1/3;
      grid-row: 1;

      margin-bottom: 40px;
    }

    .labels {
      flex-direction: column;

      font-size: 18px;
      gap: 20px;
    }

    .apr {
      flex-direction: column;
      align-items: flex-start;

      gap: 5px;

      > :first-child {
        font-size: 11px;
      }

      > :last-child {
        font-size: 30px;
      }
    }

    .buttons {
      grid-column: 1/3;
      grid-row: 3;

      max-width: unset;
      width: 100%;

      margin-top: 32px;

      justify-content: space-between;

      a {
        max-width: unset;
        flex: 1;
      }
    }
  }
`;

export const NEBSection = fixHMR(StyledNEBSection);
