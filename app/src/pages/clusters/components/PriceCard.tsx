import React from 'react';
import styled from 'styled-components';
import { Rate, UST } from '@nebula-js/types';
import { Big } from 'big.js';
import { ClusterTokenPrices } from '@nebula-js/app-fns';
import { formatToken, formatRate } from '@libs/formatter';
import { DisplayNumber } from '../../../components/common/DisplayNumber';

export interface PriceCardProps {
  prices: ClusterTokenPrices | undefined;
  desc: string | undefined;
}

export const PriceCard = ({ prices, desc }: PriceCardProps) => {
  if (!prices || !desc) return null;

  return (
    <Container>
      <h3>CURRENT PRICE (CLUSTER)</h3>
      <StyledDisplayNumber
        price={formatToken(prices.clusterPrice)}
        currency="UST"
      />
      <h3>CURRENT PRICE (ASTROPORT)</h3>
      <StyledDisplayNumber
        price={formatToken(prices.poolPrice)}
        currency="UST"
      />
      <h3>PREMIUM</h3>
      <StyledPremium premium={prices.premium}>
        <span>
          {formatToken(prices.poolPrice.minus(prices.clusterPrice) as UST<Big>)}{' '}
          UST
        </span>
        <span>
          {` (${prices.premium.gt(0) ? '+' : ''}${formatRate(
            prices.premium,
          )}%)`}
        </span>
      </StyledPremium>
      <section>{desc}</section>
    </Container>
  );
};

const StyledPremium = styled.div<{ premium: Rate<Big> }>`
  margin-top: 5px;
  margin-bottom: 32px;
  font-weight: 500;
  font-size: var(--font-size12);

  > span + span {
    color: var(
      ${({ premium }) =>
        premium.eq(0)
          ? '--color-white92'
          : premium.gt(0)
          ? '--color-blue01'
          : '--color-red01'}
    );
  }
`;

const StyledDisplayNumber = styled(DisplayNumber)`
  margin-top: 5px;
  margin-bottom: 32px;
`;

const Container = styled.div`
  width: 100%;
  background-color: var(--color-gray14);
  border-radius: 8px;
  padding: 40px 32px;
  h3 {
    font-size: 12px;
    font-weight: 500;
    color: var(--color-white44);
  }
  section {
    font-size: 14px;
    color: var(--white-64);
  }
`;
