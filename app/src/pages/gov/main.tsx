import { breakpoints } from '@nebula-js/ui';
import { MainLayout } from 'components/layouts/MainLayout';
import { fixHMR } from 'fix-hmr';
import React from 'react';
// import { Link } from 'react-router-dom';
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
      <h1>
        <span>Governance</span>
        {/* <Button
          size="small"
          color="border"
          componentProps={{ component: Link, to: '/polls' }}
        >
          Create poll
        </Button> */}
      </h1>
      <section>
        <NEBSection />
        <StakingSection />
      </section>
      <PollsTable />
    </MainLayout>
  );
}

const StyledGovMain = styled(GovMainBase)`
  h1 {
    margin-bottom: 24px;

    display: flex;
    align-items: center;
    justify-content: space-between;
  }

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
    h1 {
      margin-bottom: 20px;
    }

    > :nth-child(2) {
      height: auto;

      flex-direction: column;

      > :nth-child(2) {
        width: unset;
      }
    }
  }
`;

export default fixHMR(StyledGovMain);
