import React from 'react';
import styled from 'styled-components';
import { breakpoints } from '../../../@nebula-js/ui';
import { TotalRewards } from './TotalRewards';
import { TotalValue } from './TotalValue';

const TotalInfo = () => {
  return (
    <Container>
      <TotalValue />
      <TotalRewards></TotalRewards>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  gap: 24px;
  width: 100%;
  @media (max-width: ${breakpoints.tablet.max}px) {
    display: block;
  }
`;

export { TotalInfo };
