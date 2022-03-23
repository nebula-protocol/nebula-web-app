import { TabItem } from '@nebula-js/ui';
import { SubTab } from '@nebula-js/ui/layout/SubTab';
import { ClusterInfo } from '@nebula-js/app-fns';
import React from 'react';
import styled from 'styled-components';
import { MintAdvanced } from './Advanced';
import { MintBasic } from './Basic';
import { MintArbitrage } from './Arbitrage';
import { useTwoSteps } from 'contexts/two-steps';
import { useMintTab } from '@nebula-js/app-provider';

export interface ClusterMintProps {
  className?: string;
  clusterInfo: ClusterInfo;
}

function ClusterMintBase({ className, clusterInfo }: ClusterMintProps) {
  const { tab, tabId, tabItems, setTabId } = useMintTab();

  const { validateAndNavigate } = useTwoSteps();

  const changeTabId = (nextTab: TabItem) => {
    const navigate = () => setTabId(nextTab.id);

    validateAndNavigate(navigate);
  };

  return (
    <div className={className}>
      <SubTab
        className="mode-tab"
        items={tabItems}
        selectedItem={tab}
        onChange={changeTabId}
      />

      {tabId === 'advanced' ? (
        <MintAdvanced clusterInfo={clusterInfo} />
      ) : tabId === 'astroportArbitrage' ? (
        <MintArbitrage clusterInfo={clusterInfo} />
      ) : (
        <MintBasic clusterInfo={clusterInfo} />
      )}
    </div>
  );
}

export const ClusterMint = styled(ClusterMintBase)`
  .mode-tab {
    margin-bottom: 2.28571429em;
  }
`;
