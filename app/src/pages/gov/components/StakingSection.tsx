import { formatRate, formatUTokenWithPostfixUnits } from '@libs/formatter';
import { AnimateNumber } from '@libs/ui';
import {
  useNebBalance,
  useNebulaApp,
  useTotalNebStaked,
} from '@nebula-js/app-provider';
import { breakpoints, Section, Sub, TitledLabel } from '@nebula-js/ui';
import React from 'react';
import styled from 'styled-components';

export interface StakingSectionProps {
  className?: string;
}

function StakingSectionBase({ className }: StakingSectionProps) {
  const { contractAddress } = useNebulaApp();

  const { totalStaked, stakingRatio } = useTotalNebStaked();

  const communityNebBalance = useNebBalance(contractAddress.community);

  return (
    <Section className={className}>
      <TitledLabel
        title="TOTAL STAKED"
        text={
          <>
            <AnimateNumber format={formatUTokenWithPostfixUnits}>
              {totalStaked}
            </AnimateNumber>{' '}
            <Sub>NEB</Sub>
          </>
        }
      />
      <TitledLabel
        title="STAKING RATIO"
        text={
          <>
            <AnimateNumber format={formatRate}>{stakingRatio}</AnimateNumber>{' '}
            <Sub>%</Sub>
          </>
        }
      />
      <TitledLabel
        title="COMMUNITY POOL"
        text={
          <>
            <AnimateNumber format={formatUTokenWithPostfixUnits}>
              {communityNebBalance}
            </AnimateNumber>{' '}
            <Sub>NEB</Sub>
          </>
        }
      />
    </Section>
  );
}

export const StakingSection = styled(StakingSectionBase)`
  background-color: var(--color-gray14);

  font-size: 20px;

  display: flex;
  flex-direction: column;

  gap: 20px;

  @media (max-width: ${breakpoints.tablet.max}px) {
    font-size: 18px;
  }
`;
