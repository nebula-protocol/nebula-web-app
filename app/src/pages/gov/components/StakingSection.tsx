import {
  useApp,
  useCW20Balance,
  useCW20TokenInfoQuery,
} from '@libs/app-provider';
import { formatRate, formatUTokenWithPostfixUnits } from '@libs/formatter';
import { AnimateNumber } from '@libs/ui';
import { NebulaContants, NebulaContractAddress } from '@nebula-js/app-fns';
import { useGovStateQuery } from '@nebula-js/app-provider';
import { NEB, Rate, u } from '@nebula-js/types';
import { breakpoints, Section, Sub, TitledLabel } from '@nebula-js/ui';
import big, { Big } from 'big.js';
import React, { useMemo } from 'react';
import styled from 'styled-components';

export interface StakingSectionProps {
  className?: string;
}

function StakingSectionBase({ className }: StakingSectionProps) {
  const { contractAddress } = useApp<NebulaContractAddress, NebulaContants>();

  const govNebBalance = useCW20Balance<NEB>(
    contractAddress.cw20.NEB,
    contractAddress.gov,
  );

  const communityNebBalance = useCW20Balance<NEB>(
    contractAddress.cw20.NEB,
    contractAddress.community,
  );

  const { data: { govState } = {} } = useGovStateQuery();

  const { data: { tokenInfo } = {} } = useCW20TokenInfoQuery<NEB>(
    contractAddress.cw20.NEB,
    true,
  );

  const { totalStaked, stakingRatio } = useMemo(() => {
    if (!govNebBalance || !govState || !tokenInfo) {
      return {
        totalStaked: big(0) as u<NEB<Big>>,
        stakingRatio: big(0) as Rate<Big>,
      };
    }

    const _totalStaked = big(govNebBalance).minus(govState.total_deposit) as u<
      NEB<Big>
    >;

    const _stakingRatio = _totalStaked.div(tokenInfo.total_supply) as Rate<Big>;

    return {
      totalStaked: _totalStaked,
      stakingRatio: _stakingRatio,
    };
  }, [govNebBalance, govState, tokenInfo]);

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
