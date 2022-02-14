import React from 'react';
import styled from 'styled-components';
import { UST } from '@nebula-js/types';
import { Big } from 'big.js';
import { ClusterTokenPrices } from '@nebula-js/app-fns';
import { formatToken } from '@libs/formatter';
import { DisplayNumber } from 'components/common/DisplayNumber';
import { DisplayPremium } from 'components/common/DisplayPremium';

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
      <StyledPremium>
        <span>
          {formatToken(prices.poolPrice.minus(prices.clusterPrice) as UST<Big>)}{' '}
          UST
        </span>
        <span>
          (<DisplayPremium premium={prices.premium} />)
        </span>
      </StyledPremium>
      <section>{desc}</section>
    </Container>
  );
};

const StyledPremium = styled.div`
  margin-top: 5px;
  margin-bottom: 32px;
  font-weight: 500;
  font-size: var(--font-size12);
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
