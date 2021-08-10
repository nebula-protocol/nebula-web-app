import { breakpoints, Section, Sub, TitledLabel } from '@nebula-js/ui';
import styled from 'styled-components';
import React from 'react';

export interface StakingSectionProps {
  className?: string;
}

function StakingSectionBase({ className }: StakingSectionProps) {
  return (
    <Section className={className}>
      <TitledLabel
        title="TOTAL STAKED"
        text={
          <s>
            18M <Sub>NEB</Sub>
          </s>
        }
      />
      <TitledLabel
        title="STAKING RATIO"
        text={
          <s>
            29.14 <Sub>%</Sub>
          </s>
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
