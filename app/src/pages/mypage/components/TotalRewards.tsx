import { useClaimAllRewardsTx, useNebPrice } from '@nebula-js/app-provider';
import React, { useCallback } from 'react';
import styled from 'styled-components';
import { ClaimIcon } from '../../../@nebula-js/icons';
import { breakpoints, Button } from '../../../@nebula-js/ui';
import { DisplayNumber } from '../../../components/common/DisplayNumber';
import { useTotalValue } from '../hooks/useTotalValue';
import { Header } from './Header';
import { useTxBroadcast } from '../../../contexts/tx-broadcast';
import { d6Formatter, formatUToken } from '@libs/formatter';
import { useConnectedWallet } from '@terra-money/use-wallet';

const TotalRewards = () => {
  const connectedWallet = useConnectedWallet();

  const { totalReward, totalRewardValue, stakingReward, govReward } =
    useTotalValue();

  const nebPrice = useNebPrice();

  const { broadcast } = useTxBroadcast();

  const postTx = useClaimAllRewardsTx();

  const proceed = useCallback(async () => {
    const stream = postTx?.({
      claimStaking: stakingReward.gt(0),
      claimGov: govReward.gt(0),
    });

    if (stream) {
      broadcast(stream);
    }
  }, [broadcast, postTx, stakingReward, govReward]);

  return (
    <Container>
      <Header>
        <h3>Total Rewards</h3>
      </Header>
      <DisplayNumber
        style={{
          marginTop: 8,
          marginBottom: 8,
        }}
        price={formatUToken(totalReward)}
        currency="NEB"
      />
      <p
        style={{
          color: 'var(--color-white44)',
          fontSize: '14px',
          marginBottom: '32px',
        }}
      >
        {formatUToken(totalRewardValue)} UST
      </p>
      <SubTitle>NEB PRICE</SubTitle>
      <DisplayNumber
        style={{
          marginTop: 8,
          marginBottom: 40,
        }}
        price={d6Formatter(nebPrice)}
        currency="UST"
        size="sm"
      />
      <StyledButton
        fullWidth
        onClick={() => {
          proceed();
        }}
        disabled={
          totalReward.eq(0) ||
          !connectedWallet ||
          !connectedWallet.availablePost
        }
      >
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
