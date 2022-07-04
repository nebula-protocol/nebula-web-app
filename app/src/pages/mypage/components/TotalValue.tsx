import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import {
  formatUToken,
  formatUTokenWithPostfixUnits,
} from '../../../@libs/formatter';
import { SendIcon } from '../../../@nebula-js/icons';
import {
  breakpoints,
  PartitionBarGraph,
  partitionColor,
  TextLink,
  VerticalPartitionLabels,
} from '../../../@nebula-js/ui';
import { DisplayNumber } from '../../../components/common/DisplayNumber';
import { useTotalValue } from '../hooks/useTotalValue';
import { Big } from 'big.js';
import { u, UST } from '@nebula-js/types';
import useResizeObserver from 'use-resize-observer';
import { Header } from './Header';

const TotalValue = () => {
  const {
    totalHoldingsValue,
    totalStakingValue,
    totalGovValue,
    totalRewardValue,
  } = useTotalValue();
  const totalValues = totalHoldingsValue
    .plus(totalStakingValue)
    .plus(totalGovValue)
    .plus(totalRewardValue) as u<UST<Big>>;
  const divideValue = totalValues.eq(0) ? 1 : totalValues;

  const { width = 200, ref } = useResizeObserver();

  return (
    <Container>
      <section>
        <Header>
          <h3>Total Value</h3>
          <StyledTextLink component={Link} to="/send">
            <SendIcon
              style={{
                marginRight: '0.5em',
                transform: 'translateY(-0.1em)',
              }}
            />{' '}
            Send
          </StyledTextLink>
        </Header>
        <DisplayNumber
          price={formatUToken(totalValues)}
          currency="UST"
          style={{ marginTop: 8, marginBottom: 94 }}
        />
      </section>
      <section ref={ref}>
        <VerticalPartitionLabels
          data={[
            {
              label: 'HOLDINGS',
              value: `${formatUTokenWithPostfixUnits(totalHoldingsValue)} UST`,
              color: partitionColor[0],
            },
            {
              label: 'STAKING',
              value: `${formatUTokenWithPostfixUnits(totalStakingValue)} UST`,
              color: partitionColor[1],
            },
            {
              label: 'GOVERNANCE',
              value: `${formatUTokenWithPostfixUnits(totalGovValue)} UST`,
              color: partitionColor[2],
            },
            {
              label: 'REWARDS',
              value: `${formatUTokenWithPostfixUnits(totalRewardValue)} UST`,
              color: partitionColor[3],
            },
          ]}
        />
        {totalValues.toNumber() > 0 && (
          <PartitionBarGraph
            data={[
              {
                value: Number(totalHoldingsValue.div(divideValue).toFixed(2)),
                color: partitionColor[0],
              },
              {
                value: Number(totalStakingValue.div(divideValue).toFixed(2)),
                color: partitionColor[1],
              },
              {
                value: Number(totalGovValue.div(divideValue).toFixed(2)),
                color: partitionColor[2],
              },
              {
                value: Number(totalRewardValue.div(divideValue).toFixed(2)),
                color: partitionColor[3],
              },
            ]}
            width={width}
            height={5}
          />
        )}
      </section>
    </Container>
  );
};

const Container = styled.div`
  flex: 3;
  padding: 40px 32px;
  border-radius: 8px;
  background-color: var(--color-gray3);
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  @media (max-width: ${breakpoints.tablet.max}px) {
    margin-top: 11px;
    padding: 1rem;
  }
`;

const StyledTextLink = styled(TextLink)`
  font-size: 12px;
  font-weight: 500;
`;

export { TotalValue };
