import { Sub } from '@nebula-js/ui';
import React from 'react';
import styled from 'styled-components';
import { UST } from '@libs/types';
import { Big } from 'big.js';
import { formatToken } from '@libs/formatter';

export interface PriceCardProps {
  price: UST<Big> | undefined;
  desc: string | undefined;
}

export const PriceCard = ({ price, desc }: PriceCardProps) => {
  if (!price || !desc) return null;
  const splitPrice = formatToken(price).split('.');

  return (
    <Container>
      <h3>CURRENT PRICE</h3>
      <DisplayNumber>
        {splitPrice[0]}
        <Sub>.{splitPrice[1]} UST</Sub>
      </DisplayNumber>
      <section>{desc}</section>
    </Container>
  );
};

const DisplayNumber = styled.p`
  color: var(--color-white92);
  font-size: 32px;
  font-weight: 500;
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
