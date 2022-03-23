import { SubTab } from '@nebula-js/ui/layout/SubTab';
import { ClusterInfo } from '@nebula-js/app-fns';
import React from 'react';
import styled from 'styled-components';
import { BurnAdvanced } from './Advanced';
import { BurnBasic } from './Basic';
import { BurnTerraswapArbitrage } from './TerraswapArbitrage';
import { useBurnTab } from '@nebula-js/app-provider';

export interface ClusterBurnProps {
  className?: string;
  clusterInfo: ClusterInfo;
}

function ClusterBurnBase({ className, clusterInfo }: ClusterBurnProps) {
  const { tab, tabId, tabItems, setTabId } = useBurnTab();

  return (
    <div className={className}>
      <SubTab
        className="mode-tab"
        items={tabItems}
        selectedItem={tab}
        onChange={(nextTab) => setTabId(nextTab.id)}
      />

      {tabId === 'advanced' ? (
        <BurnAdvanced clusterInfo={clusterInfo} />
      ) : tabId === 'astroportArbitrage' ? (
        <BurnTerraswapArbitrage clusterInfo={clusterInfo} />
      ) : (
        <BurnBasic clusterInfo={clusterInfo} />
      )}
    </div>
  );
}

export const ClusterBurn = styled(ClusterBurnBase)`
  .mode-tab {
    margin-bottom: 2.28571429em;
  }
`;
