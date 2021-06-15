import { breakpoints } from '@nebula-js/ui';
import { MainLayout } from 'components/layouts/MainLayout';
import React from 'react';
import styled from 'styled-components';
import { NEBSection } from './components/NEBSection';
import { PollsTable } from './components/PollsTable';
import { StakingSection } from './components/StakingSection';

export interface GovMainProps {
  className?: string;
}

function GovMainBase({ className }: GovMainProps) {
  return (
    <MainLayout className={className}>
      <h1>Governance</h1>
      <section>
        <NEBSection />
        <StakingSection />
      </section>
      <PollsTable />
    </MainLayout>
  );
}

export default styled(GovMainBase)`
  > :nth-child(2) {
    display: flex;
    gap: 24px;

    > :first-child {
      min-height: 269px;

      flex: 1;
    }

    > :nth-child(2) {
      width: 352px;
    }

    margin-bottom: 40px;
  }

  @media (max-width: ${breakpoints.tablet.max}px) {
    > :nth-child(2) {
      height: auto;

      flex-direction: column;

      > :nth-child(2) {
        width: unset;
      }
    }
  }
`;
