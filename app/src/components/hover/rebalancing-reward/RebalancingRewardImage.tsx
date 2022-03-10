import React from 'react';
import rewardImage from 'components/assets/weekly-reward.svg';

export interface RebalancingRewardImageProps {
  className?: string;
}

export function RebalancingRewardImage({
  className,
}: RebalancingRewardImageProps) {
  return <img src={rewardImage} className={className} alt="Weekly Reward!" />;
}
