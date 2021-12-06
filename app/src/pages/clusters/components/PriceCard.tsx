import React from 'react';
import styled from 'styled-components';
import { UST } from '@libs/types';
import { Big } from 'big.js';
import { formatToken } from '@libs/formatter';
import { DisplayNumber } from '../../../components/common/DisplayNumber';

export interface PriceCardProps {
  price: UST<Big> | undefined;
  desc: string | undefined;
}

export const PriceCard = ({ price, desc }: PriceCardProps) => {
  if (!price || !desc) return null;

  return (
    <Container>
      <h3>CURRENT PRICE</h3>
      <StyledDisplayNumber price={formatToken(price)} currency="UST" />
      <section>{desc}</section>
    </Container>
  );
};

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
