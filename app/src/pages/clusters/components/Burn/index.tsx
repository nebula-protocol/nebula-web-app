import { TabItem } from '@nebula-js/ui';
import { SubTab } from '@nebula-js/ui/layout/SubTab';
import { ClusterInfo } from '@nebula-js/webapp-fns';
import { useLocalStorage } from '@terra-dev/use-local-storage';
import React, { useMemo } from 'react';
import styled from 'styled-components';
import { BurnAdvanced } from './Advanced';
import { BurnBasic } from './Basic';
import { BurnTerraswapArbitrage } from './TerraswapArbitrage';

export interface ClusterBurnProps {
  className?: string;
  clusterInfo: ClusterInfo;
}

const tabItems: TabItem[] = [
  { id: 'basic', label: 'Basic' },
  { id: 'advanced', label: 'Advanced' },
  { id: 'terraswapArbitrage', label: 'Terraswap Arbitrage' },
];

const TAB_KEY = '__nebula_burn_tab__';

function ClusterBurnBase({ className, clusterInfo }: ClusterBurnProps) {
  const [tabId, setTabId] = useLocalStorage(TAB_KEY, () => tabItems[1].id);

  const tab = useMemo(() => {
    return tabItems.find(({ id }) => tabId === id) ?? tabItems[1];
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
        <BurnAdvanced clusterInfo={clusterInfo} />
      ) : tabId === 'terraswapArbitrage' ? (
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
