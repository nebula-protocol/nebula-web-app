import { computeProvided, computeTotalProvided } from '@nebula-js/app-fns';
import { useClustersInfoListQuery } from '@nebula-js/app-provider';
import { Rate, u, UST } from '@nebula-js/types';
import { VerticalLabelAndValue } from '@nebula-js/ui';
import big from 'big.js';
import { fixHMR } from 'fix-hmr';
import React, { useMemo } from 'react';
import styled, { useTheme } from 'styled-components';
import { PieChart } from './PieChart';
import { Table } from './Table';
import { Item } from './types';
import { formatUTokenWithPostfixUnits } from '@libs/formatter';
import { divWithDefault } from '@libs/big-math';

export interface ClusterDistributionProps {
  className?: string;
}

const colors = ['#E0687F', '#A87D99', '#6F9EBB', '#5BBAD6'];

function ClusterDistributionBase({ className }: ClusterDistributionProps) {
  const theme = useTheme();

  const { data: clusterInfos = [] } = useClustersInfoListQuery();

  const totalProvided = computeTotalProvided(clusterInfos);

  const data = useMemo<Item[]>(() => {
    if (clusterInfos.length === 0) {
      return [];
    }

    const distributions = clusterInfos.map<Item>(
      ({ clusterState, clusterTokenInfo }, i) => {
        const provided = computeProvided(clusterState).toFixed() as u<UST>;

        return {
          id: clusterState.cluster_contract_address,
          name: clusterTokenInfo.name,
          symbol: clusterTokenInfo.symbol,
          provided,
          color: colors[i % colors.length],
          ratio: '0' as Rate,
        };
      },
    );

    for (const distribution of distributions) {
      distribution.ratio = divWithDefault(
        distribution.provided,
        totalProvided,
        0,
      ).toFixed() as Rate;
    }

    const sortedDistributions = distributions.sort((a, b) => {
      return big(b.provided).minus(a.provided).toNumber();
    });

    const top3 = sortedDistributions.slice(0, 3);
    const othersList = sortedDistributions.slice(3);
    const others = sortedDistributions.slice(3).reduce(
      (o, { provided, ratio }) => {
        o.provided = big(o.provided).plus(provided).toFixed() as u<UST>;
        o.ratio = big(o.ratio).plus(ratio).toFixed() as Rate;
        return o;
      },
      {
        id: 'others',
        name: 'Others',
        color: colors[3],
        provided: '0' as u<UST>,
        symbol: 'others',
        ratio: '0' as Rate,
      } as Item,
    );

    return othersList.length > 0 ? [...top3, others] : [...top3];
  }, [clusterInfos, totalProvided]);

  return (
    <div className={className}>
      <VerticalLabelAndValue
        className="inventory-value"
        label="INVENTORY VALUE"
      >
        {formatUTokenWithPostfixUnits(totalProvided)} UST
      </VerticalLabelAndValue>

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
