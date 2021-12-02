import React from 'react';
import styled from 'styled-components';
import { formatUToken } from '../../../@libs/formatter';
import { ClaimIcon } from '../../../@nebula-js/icons';
import { breakpoints, Button } from '../../../@nebula-js/ui';
import { DisplayNumber } from '../../../components/common/DisplayNumber';
import { useTotalValue } from '../hooks/useTotalValue';
import { Header } from './Header';

const TotalRewards = () => {
  const { totalReward, totalRewardValue } = useTotalValue();
  return (
    <Container>
      <Header>
        <h3>Total Rewards</h3>
      </Header>
      <DisplayNumber
        style={{
          marginTop: 8,
          marginBottom: 32,
        }}
        price={formatUToken(totalReward)}
        currency="NEB"
      />
      <SubTitle>NEB PRICE</SubTitle>
      <DisplayNumber
        style={{
          marginTop: 8,
          marginBottom: 40,
        }}
        price={formatUToken(totalRewardValue)}
        currency="UST"
        size="sm"
      />
      <StyledButton fullWidth>
        <ClaimIcon />
        Claim All Rewards
      </StyledButton>
    </Container>
  );
};

const StyledButton = styled(Button)`
  display: flex;
  min-width: 100px;
  align-items: center;
  flex-shrink: 0;
  height: 42px;
  font-size: 14px;
  > svg {
    font-size: 18px;
    margin-top: 6px;
  }
`;

const SubTitle = styled.h4`
  font-size: 12px;
  font-weight: 500;
  color: var(--color-white44);
`;

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
