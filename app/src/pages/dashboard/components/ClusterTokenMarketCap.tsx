import { formatUTokenIntegerWithPostfixUnits } from '@libs/formatter';
import { u, UST } from '@nebula-js/types';
import { AnimateNumber, Sub } from '@nebula-js/ui';
import { computeMarketCap } from '@nebula-js/webapp-fns';
import { useClustersInfoListQuery } from '@nebula-js/webapp-provider';
import { sum } from '@libs/big-math';
import big, { Big } from 'big.js';
import React, { useMemo } from 'react';
import styled from 'styled-components';

export interface ClusterTokenMarketCapProps {
  className?: string;
}

function ClusterTokenMarketCapBase({ className }: ClusterTokenMarketCapProps) {
  const { data: clusterInfos = [] } = useClustersInfoListQuery();

  const marketCapTotal = useMemo(() => {
    if (clusterInfos.length === 0) {
      return big(0) as u<UST<Big>>;
    }

    const marketCaps = clusterInfos.map(({ clusterState, terraswapPool }) => {
      return computeMarketCap(clusterState, terraswapPool);
    });

    return sum(...marketCaps) as u<UST<Big>>;
  }, [clusterInfos]);

  return (
    <div className={className}>
      <p>
        <AnimateNumber format={formatUTokenIntegerWithPostfixUnits}>
          {marketCapTotal}
        </AnimateNumber>{' '}
        <Sub>UST</Sub>
      </p>
    </div>
  );
}

export const ClusterTokenMarketCap = styled(ClusterTokenMarketCapBase)`
  p {
    font-size: var(--font-size32);
  }
`;
