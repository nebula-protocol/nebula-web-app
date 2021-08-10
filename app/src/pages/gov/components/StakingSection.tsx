import { formatRate, formatUTokenWithPostfixUnits } from '@nebula-js/notation';
import { NEB, Rate, u } from '@nebula-js/types';
import {
  AnimateNumber,
  breakpoints,
  Section,
  Sub,
  TitledLabel,
} from '@nebula-js/ui';
import {
  useCW20BalanceQuery,
  useCW20TokenInfoQuery,
  useGovStateQuery,
  useNebulaWebapp,
} from '@nebula-js/webapp-provider';
import big, { Big } from 'big.js';
import React, { useMemo } from 'react';
import styled from 'styled-components';

export interface StakingSectionProps {
  className?: string;
}

function StakingSectionBase({ className }: StakingSectionProps) {
  const { contractAddress } = useNebulaWebapp();

  const { data: { tokenBalance } = {} } = useCW20BalanceQuery<NEB>(
    contractAddress.cw20.NEB,
    contractAddress.gov,
  );

  const { data: { govState } = {} } = useGovStateQuery();

  const { data: { tokenInfo } = {} } = useCW20TokenInfoQuery<NEB>(
    contractAddress.cw20.NEB,
  );

  const { totalStaked, stakingRatio } = useMemo(() => {
    if (!tokenBalance || !govState || !tokenInfo) {
      return {
        totalStaked: big(0) as u<NEB<Big>>,
        stakingRatio: big(0) as Rate<Big>,
      };
    }

    const _totalStaked = big(tokenBalance.balance).minus(
      govState.total_deposit,
    ) as u<NEB<Big>>;

    const _stakingRatio = _totalStaked.div(tokenInfo.total_supply) as Rate<Big>;

    return {
      totalStaked: _totalStaked,
      stakingRatio: _stakingRatio,
    };
  }, [govState, tokenBalance, tokenInfo]);

  console.log('StakingSection.tsx..StakingSectionBase()', tokenBalance);

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
          <s>
            22.22M <Sub>NEB</Sub>
          </s>
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
