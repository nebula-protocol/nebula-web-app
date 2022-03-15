import { TabItem } from '@nebula-js/ui';
import { SubTab } from '@nebula-js/ui/layout/SubTab';
import { ClusterInfo } from '@nebula-js/app-fns';
import { useLocalStorage } from '@libs/use-local-storage';
import React, { useMemo } from 'react';
import styled from 'styled-components';
import { MintAdvanced } from './Advanced';
import { MintBasic } from './Basic';
import { MintArbitrage } from './Arbitrage';
import { useTwoSteps } from 'contexts/two-steps';

export interface ClusterMintProps {
  className?: string;
  clusterInfo: ClusterInfo;
}

const tabItems: TabItem[] = [
  { id: 'basic', label: 'Basic' },
  { id: 'advanced', label: 'Advanced' },
  { id: 'astroportArbitrage', label: 'Astroport Arbitrage' },
];

const TAB_KEY = '__nebula_mint_tab__';

function ClusterMintBase({ className, clusterInfo }: ClusterMintProps) {
  const [tabId, setTabId] = useLocalStorage(TAB_KEY, () => tabItems[0].id);

  const { validateAndNavigate } = useTwoSteps();

  const tab = useMemo(() => {
    return tabItems.find(({ id }) => tabId === id) ?? tabItems[0];
  }, [tabId]);

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
