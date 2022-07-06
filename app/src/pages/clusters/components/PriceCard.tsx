import React from 'react';
import styled from 'styled-components';
import { Luna, u } from '@nebula-js/types';
import { Big } from 'big.js';
import { ClusterTokenPrices } from '@nebula-js/app-fns';
import { formatToken, formatUTokenWithPostfixUnits } from '@libs/formatter';
import { DisplayNumber } from 'components/common/DisplayNumber';
import { DisplayPremium } from 'components/common/DisplayPremium';
import { InfoTooltip } from '@nebula-js/ui';

export interface PriceCardProps {
  prices: ClusterTokenPrices | undefined;
  liquidity: u<Luna<Big>> | undefined;
  desc: string | undefined;
}

export const PriceCard = ({ prices, liquidity, desc }: PriceCardProps) => {
  if (!prices || !liquidity || !desc) return null;

  return (
    <Container>
      <h3>
        CLUSTER PRICE (INTRINSIC){' '}
        <InfoTooltip>
          Price of cluster as calculated by total cluster inventory value
          divided by cluster token total supply
        </InfoTooltip>
      </h3>
      <StyledPrice price={formatToken(prices.clusterPrice)} currency="Luna" />
      <h3>
        CLUSTER PRICE (MARKET){' '}
        <InfoTooltip>
          Price of cluster as calculated from its Astroport pool
        </InfoTooltip>
      </h3>
      <StyledPrice price={formatToken(prices.poolPrice)} currency="Luna" />
      <h3>PREMIUM</h3>
      <StyledNumber>
        <span>
          {formatToken(
            prices.poolPrice.minus(prices.clusterPrice) as Luna<Big>,
          )}{' '}
          Luna
        </span>
        <span>
          (<DisplayPremium premium={prices.premium} />)
        </span>
      </StyledNumber>
      <h3>LIQUIDITY</h3>
      <StyledNumber>
        <span>{formatUTokenWithPostfixUnits(liquidity)} Luna</span>
      </StyledNumber>
      <section>{desc}</section>
    </Container>
  );
};

const StyledNumber = styled.div`
  margin-top: 5px;
  margin-bottom: 32px;
  font-weight: 500;
  font-size: var(--font-size12);
`;

const StyledPrice = styled(DisplayNumber)`
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
