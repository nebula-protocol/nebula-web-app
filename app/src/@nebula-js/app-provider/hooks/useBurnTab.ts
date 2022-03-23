import { useLocalStorage } from '@libs/use-local-storage';
import { TabItem } from '@nebula-js/ui';
import { useMemo } from 'react';

const TAB_KEY = '__nebula_burn_tab__';

const tabItems: TabItem[] = [
  { id: 'basic', label: 'Basic' },
  { id: 'advanced', label: 'Advanced' },
  { id: 'astroportArbitrage', label: 'Astroport Arbitrage' },
];

export function useBurnTab() {
  const [tabId, setTabId] = useLocalStorage(TAB_KEY, () => tabItems[0].id);

  const tab = useMemo(() => {
    return tabItems.find(({ id }) => tabId === id) ?? tabItems[0];
  }, [tabId]);

  return { tab, tabId, tabItems, setTabId };
}
