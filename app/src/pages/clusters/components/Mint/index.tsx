import { TabItem } from '@nebula-js/ui';
import { SubTab } from '@nebula-js/ui/layout/SubTab';
import { ClusterInfo } from '@nebula-js/app-fns';
import { useLocalStorage } from '@libs/use-local-storage';
import React, { useMemo } from 'react';
import styled from 'styled-components';
import { MintAdvanced } from './Advanced';
import { MintBasic } from './basic';
import { MintTerraswapArbitrage } from './TerraswapArbitrage';

export interface ClusterMintProps {
  className?: string;
  clusterInfo: ClusterInfo;
}

const tabItems: TabItem[] = [
  { id: 'basic', label: 'Basic' },
  { id: 'advanced', label: 'Advanced' },
  { id: 'terraswapArbitrage', label: 'Terraswap Arbitrage' },
];

const TAB_KEY = '__nebula_mint_tab__';

function ClusterMintBase({ className, clusterInfo }: ClusterMintProps) {
  const [tabId, setTabId] = useLocalStorage(TAB_KEY, () => tabItems[0].id);

  const tab = useMemo(() => {
    return tabItems.find(({ id }) => tabId === id) ?? tabItems[0];
  }, [tabId]);

  return (
    <div className={className}>
      <SubTab
        className="mode-tab"
        items={tabItems}
        selectedItem={tab}
        onChange={(nextTab) => setTabId(nextTab.id)}
      />

      {tabId === 'advanced' ? (
        <MintAdvanced clusterInfo={clusterInfo} />
      ) : tabId === 'terraswapArbitrage' ? (
        <MintTerraswapArbitrage clusterInfo={clusterInfo} />
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
