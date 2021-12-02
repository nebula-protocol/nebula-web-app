import React from 'react';
import styled from 'styled-components';
import { breakpoints } from '../../../@nebula-js/ui';

const TotalRewards = () => {
  return <Container>TotalRewards</Container>;
};

const Container = styled.div`
  flex: 2;
  padding: 40px 32px;
  border-radius: 8px;
  background-color: var(--color-gray14);
  @media (max-width: ${breakpoints.tablet.max}px) {
    margin-top: 11px;
    padding: 1rem;
  }
`;

export { TotalRewards };
