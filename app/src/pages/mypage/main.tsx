import { breakpoints, Tab, TabItem, useScreenSizeValue } from '@nebula-js/ui';
import { useWallet, WalletStatus } from '@terra-money/use-wallet';
import { MainLayout } from 'components/layouts/MainLayout';
import { fixHMR } from 'fix-hmr';
import { Governance } from 'pages/mypage/components/Governance';
import { Holdings } from 'pages/mypage/components/Holdings';
import { Staking } from 'pages/mypage/components/Staking';
import React, { useState } from 'react';
import styled from 'styled-components';
import { NotConnected } from './components/NotConnected';
import { TotalInfo } from './components/TotalInfo';

export interface MyPageMainProps {
  className?: string;
}

const tabItems: TabItem[] = [
  { id: 'all', label: 'All' },
  { id: 'holdings', label: 'Holdings' },
  { id: 'staking', label: 'Staking' },
  { id: 'governance', label: 'Governance' },
];

function MyPageMainBase({ className }: MyPageMainProps) {
  const { status } = useWallet();
  const [tab, setTab] = useState<TabItem>(() => tabItems[0]);

  const showAll = useScreenSizeValue<boolean>({
    mobile: true,
    tablet: true,
    pc: false,
    monitor: false,
  });

  if (status === WalletStatus.INITIALIZING) return null;

  if (status === WalletStatus.WALLET_NOT_CONNECTED) {
    return <NotConnected />;
  }

  return (
    <MainLayout className={className}>
      <h1>My Page</h1>
      <TotalInfo />
      {!showAll && (
        <Tab
          className="tab"
          items={tabItems}
          selectedItem={tab}
          onChange={setTab}
        />
      )}
      {(showAll || tab.id === 'all' || tab.id === 'holdings') && <Holdings />}
      {(showAll || tab.id === 'all' || tab.id === 'staking') && <Staking />}
      {(showAll || tab.id === 'all' || tab.id === 'governance') && (
        <Governance />
      )}
    </MainLayout>
  );
}

const StyledMyPageMain = styled(MyPageMainBase)`
  h1 {
    margin-bottom: 24px;
  }

  .tab {
    margin-bottom: 40px;
  }

  > :not(h1):not(.tab) {
    margin-bottom: 24px;
  }

  @media (max-width: ${breakpoints.tablet.max}px) {
    h1 {
      margin-bottom: 20px;
    }

    > :not(h1):not(.tab) {
      margin-bottom: 11px;
    }
  }
`;

export default fixHMR(StyledMyPageMain);
