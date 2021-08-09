import { Rate, u, UST } from '@nebula-js/types';
import { computeMarketCap } from '@nebula-js/webapp-fns';
import { useClustersInfoListQuery } from '@nebula-js/webapp-provider';
import { sum } from '@terra-dev/big-math';
import big from 'big.js';
import { fixHMR } from 'fix-hmr';
import React, { useMemo } from 'react';
import styled, { useTheme } from 'styled-components';
import { PieChart } from './PieChart';
import { Table } from './Table';
import { Item } from './types';

export interface ClusterDistributionProps {
  className?: string;
}

const colors = ['#E0687F', '#A87D99', '#6F9EBB', '#5BBAD6'];

function ClusterDistributionBase({ className }: ClusterDistributionProps) {
  const theme = useTheme();

  const { data: clusterInfos = [] } = useClustersInfoListQuery();

  const data = useMemo<Item[]>(() => {
    if (clusterInfos.length === 0) {
      return [];
    }

    const distributions = clusterInfos.map<Item>(
      ({ clusterState, terraswapPool, clusterTokenInfo }, i) => {
        const marketCap = computeMarketCap(
          clusterState,
          terraswapPool,
        ).toFixed() as u<UST>;

        return {
          name: clusterTokenInfo.name,
          symbol: clusterTokenInfo.symbol,
          marketCap: marketCap,
          color: colors[i % colors.length],
          ratio: '0' as Rate,
        };
      },
    );

    const marketCapTotal = sum(
      ...distributions.map(({ marketCap }) => marketCap),
    );

    for (const distribution of distributions) {
      distribution.ratio = big(distribution.marketCap)
        .div(marketCapTotal)
        .toFixed() as Rate;
    }

    const sortedDistributions = distributions.sort((a, b) => {
      return big(b.marketCap).minus(a.marketCap).toNumber();
    });

    const top3 = sortedDistributions.slice(0, 3);
    const others = sortedDistributions.slice(3).reduce(
      (o, { marketCap, ratio }) => {
        o.marketCap = big(o.marketCap).plus(marketCap).toFixed() as u<UST>;
        o.ratio = big(o.ratio).plus(ratio).toFixed() as Rate;
        return o;
      },
      {
        marketCap: '0' as u<UST>,
        ratio: '0' as Rate,
        color: colors[3],
        name: 'Others',
        symbol: 'others',
      } as Item,
    );

    return [...top3, others];
  }, [clusterInfos]);

  return (
    <div className={className}>
      <PieChart data={data} theme={theme} />
      <Table data={data} />
    </div>
  );
}

const StyledClusterDistribution = styled(ClusterDistributionBase)`
  canvas {
    max-height: 270px;
  }
`;

export const ClusterDistribution = fixHMR(StyledClusterDistribution);
