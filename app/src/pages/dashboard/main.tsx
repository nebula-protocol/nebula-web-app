import { breakpoints, Section } from '@nebula-js/ui';
import { MainLayout } from 'components/layouts/MainLayout';
import React from 'react';
import Masonry from 'react-masonry-css';
import styled from 'styled-components';
import { ClusterDistribution } from './components/ClusterDistribution';
import { ClusterTokenMarketCap } from './components/ClusterTokenMarketCap';
import { NEBPrice } from './components/NEBPrice';
import { TopClusters } from './components/TopClusters';
import { TotalProvided } from './components/TotalProvided';
import { TradingVolume } from './components/TradingVolume';

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
          <h3>Cluster Token Market Cap</h3>
          <ClusterTokenMarketCap />
        </Section>
        <Section>
          <h3>NEB Price</h3>
          <NEBPrice />
        </Section>
        <Section>
          <h3>Cluster Distribution</h3>
          <ClusterDistribution />
        </Section>
        <Section>
          <h3>Total Provided</h3>
          <TotalProvided />
        </Section>
        <Section>
          <h3 style={{ marginBottom: '2em' }}>Top Clusters</h3>
          <TopClusters />
        </Section>
        <Section>
          <h3>Trading Volume</h3>
          <TradingVolume />
        </Section>
      </Masonry>
    </MainLayout>
  );
}

export default styled(DashboardMainBase)`
  h1 {
    margin-bottom: 24px;
  }

  --grid-gap: 1.5em;

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
    font-size: 1.15em;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.white92};
    margin-bottom: 0.6em;
  }

  @media (max-width: ${breakpoints.tablet.max}px) {
    h1 {
      margin-bottom: 20px;
    }

    --grid-gap: 16px;
  }
`;
