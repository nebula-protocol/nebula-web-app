import { formatUTokenWithPostfixUnits } from '@libs/formatter';
import { AnimateNumber } from '@libs/ui';
import {
  breakpoints,
  Button,
  CoupledIconsHolder,
  sectionStyle,
  Sub,
  TitledLabel,
} from '@nebula-js/ui';
import { fixHMR } from 'fix-hmr';
import React, { DetailedHTMLProps } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { StakingView } from '../models/staking';

export interface StakingCardsProps
  extends DetailedHTMLProps<
    React.HTMLAttributes<HTMLUListElement>,
    HTMLUListElement
  > {
  className?: string;
  staking: StakingView;
}

function StakingCardsBase({ staking, ...sectionProps }: StakingCardsProps) {
  return (
    <ul {...sectionProps}>
      {staking.map(
        ({ id, totalStaked, apr, index, symbol, nameLowerCase, name }, i) => (
          <li key={'row' + id}>
            <h3>
              <CoupledIconsHolder radiusEm={1}>
                <figure />
                <figure />
              </CoupledIconsHolder>
              {name}
            </h3>

            <section className="apr">
              <div>APR</div>
              <div>
                <s>
                  <span>80</span>
                  <Sub>.8%</Sub>
                </s>
              </div>
            </section>

            <TitledLabel
              className="total-staked"
              title="TOTAL STAKED"
              text={
                <>
                  <AnimateNumber format={formatUTokenWithPostfixUnits}>
                    {totalStaked}
                  </AnimateNumber>{' '}
                  <Sub>UST</Sub>
                </>
              }
            />

            <footer className="buttons">
              <Button
                size="small"
                color="paleblue"
                componentProps={{
                  component: Link,
                  to: `/staking/${id}/stake`,
                }}
              >
                Stake
              </Button>
              <Button
                size="small"
                color="border"
                componentProps={{
                  component: Link,
                  to: `/staking/${id}/unstake`,
                }}
              >
                Unstake
              </Button>
            </footer>
          </li>
        ),
      )}
    </ul>
  );
}

export const StyledStakingCards = styled(StakingCardsBase)`
  list-style: none;
  padding: 0;

  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.42857143em;

  > li {
    min-width: 0;

    ${sectionStyle};

    background-color: var(--color-gray14);
  }

  h3 {
    display: flex;
    align-items: center;
    gap: 0.6em;

    font-size: 1.42857142857143em;

    font-weight: 500 !important;

    figure:nth-of-type(1) {
      border: 1px solid var(--color-gray34);
    }

    figure:nth-of-type(2) {
      background-color: var(--color-gray34);
    }
  }

  .apr {
    margin-top: 3.42857142857143em;

    display: flex;
    gap: 12px;
    align-items: flex-end;

    > :first-child {
      font-size: 12px;
      color: var(--color-paleblue);

      border: 1px solid var(--color-paleblue);
      border-radius: 16px;
      padding: 2px 8px;

      transform: translateY(-4px);
    }

    > :last-child {
      font-size: 32px;
      line-height: 1em;
      max-height: 1em;
    }
  }

  .total-staked {
    margin-top: 1.85714285714286em;
  }

  .buttons {
    margin-top: 2.85714285714286em;

    display: flex;
    gap: 0.857142857142857em;

    a {
      flex: 1;
    }
  }

  @media (max-width: ${breakpoints.tablet.max}px) {
    grid-template-columns: 1fr;
  }
`;

export const StakingCards = fixHMR(StyledStakingCards);
