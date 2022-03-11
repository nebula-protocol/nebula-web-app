import { RebalancingRewardContent } from './RebalancingRewardContent';
import styled from 'styled-components';
import React, { useState, useCallback } from 'react';
import {
  useClaimIncentiveRewardsTx,
  useIncentiveRewardQuery,
} from '@nebula-js/app-provider';
import big from 'big.js';
import { useTxBroadcast } from 'contexts/tx-broadcast';

export interface RebalancingRewardProps {
  className?: string;
  isMobile: boolean;
}

export function RebalancingReward({
  className,
  isMobile,
}: RebalancingRewardProps) {
  const [rewardClosed, setRewardClosed] = useState(false);

  const { data: reward } = useIncentiveRewardQuery();

  const display =
    !rewardClosed &&
    !!reward &&
    big(reward.incentiveReward.pending_rewards).gt(0);

  const { broadcast } = useTxBroadcast();

  const postTx = useClaimIncentiveRewardsTx();

  const proceed = useCallback(async () => {
    const stream = postTx?.();

    if (stream) {
      broadcast(stream);
    }
  }, [broadcast, postTx]);

  return display ? (
    <Container
      className={className}
      data-layout={isMobile ? 'mobile' : 'modal'}
    >
      <RebalancingRewardContent
        onClose={() => setRewardClosed(true)}
        isMobileLayout={isMobile}
        claim={proceed}
        rewardAmount={reward.incentiveReward.pending_rewards}
      />
    </Container>
  ) : null;
}

const Container = styled.div`
  min-width: 260px;
  height: 240px;
  padding: 32px 24px;

  box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.15);
  background-color: var(--color-gray18);
  border-radius: 8px;

  &[data-layout='mobile'] {
    box-shadow: 0;
    border-radius: 0;
    height: auto;
    padding: 0;
  }

  button {
    cursor: pointer;
  }
`;
