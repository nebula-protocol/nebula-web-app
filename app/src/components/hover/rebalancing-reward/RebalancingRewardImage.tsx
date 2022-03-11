import React from 'react';
import rewardImage from 'components/assets/rebalancing-reward.svg';

export interface RebalancingRewardImageProps {
  className?: string;
}

export function RebalancingRewardImage({
  className,
}: RebalancingRewardImageProps) {
  return (
    <img
      src={rewardImage}
      width={50}
      className={className}
      alt="Rebalancing Reward!"
    />
  );
}
