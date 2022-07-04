import { breakpoints, InfoTooltip, Section } from '@nebula-js/ui';
import { MainLayout } from 'components/layouts/MainLayout';
import { fixHMR } from 'fix-hmr';
import React from 'react';
import Masonry from 'react-masonry-css';
import styled from 'styled-components';
import { ClusterDistribution } from './components/ClusterDistribution';
import { NEBPrice } from './components/NEBPrice';
import { TopClusters } from './components/TopClusters';
import { TotalValueLocked } from './components/TotalValueLocked';

export interface DashboardMainProps {
  className?: string;
}

const breakpointCols = {
  default: 2,
  1000: 1,
};

function DashboardMainBase({ className }: DashboardMainProps) {
  return (
    <MainLayout className={className}>
      <h1>Dashboard</h1>

      <Masonry
        breakpointCols={breakpointCols}
        className="masonry-grid"
        columnClassName="masonry-column"
      >
        <Section>
          <h3>
            Total Value Locked{' '}
            <InfoTooltip>
              Total value of all cluster inventory, withdrawable liquidity,
              rewards, staked NEB and UST.
            </InfoTooltip>
          </h3>
          <TotalValueLocked />
        </Section>
        <Section>
          <h3>
            NEB Price{' '}
            <InfoTooltip>
              NEB token price from the NEB-UST Astroport pool
            </InfoTooltip>
          </h3>
          <NEBPrice />
        </Section>
        <Section>
          <h3 style={{ marginBottom: '2em' }}>
            Top Clusters{' '}
            <InfoTooltip>
              Top ranking clusters by cluster market cap
            </InfoTooltip>
          </h3>
          <TopClusters />
        </Section>
        <Section>
          <h3>
            Cluster Distribution{' '}
            <InfoTooltip>
              Distribution of all the Nebula cluster based on inventory
              value/market cap
            </InfoTooltip>
          </h3>
          <ClusterDistribution />
        </Section>
      </Masonry>
    </MainLayout>
  );
}

const StyledDashboardMain = styled(DashboardMainBase)`
  h1 {
    margin-bottom: 24px;
  }

  --grid-gap: 20px;

  .masonry-grid {
    display: flex;
    width: auto;
    margin-left: calc(var(--grid-gap) * -1);
  }

  .masonry-column {
    padding-left: var(--grid-gap);
    background-clip: padding-box;

    > * {
      margin-bottom: var(--grid-gap);
    }
  }

  h3 {
    font-size: var(--font-size16-14);
    font-weight: 500;
    color: var(--color-white2);
    margin-bottom: 8px;
  }

  @media (max-width: ${breakpoints.tablet.max}px) {
    h1 {
      margin-bottom: 20px;
    }

    --grid-gap: 16px;
  }
`;

export default fixHMR(StyledDashboardMain);
