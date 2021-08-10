import { breakpoints, Tab, TabItem, useScreenSizeValue } from '@nebula-js/ui';
import { MainLayout } from 'components/layouts/MainLayout';
import { fixHMR } from 'fix-hmr';
import { Governance } from 'pages/mypage/components/Governance';
import { History } from 'pages/mypage/components/History';
import { Holdings } from 'pages/mypage/components/Holdings';
import { Staking } from 'pages/mypage/components/Staking';
import React, { useState } from 'react';
import styled from 'styled-components';

export interface MyPageMainProps {
  className?: string;
}

const tabItems: TabItem[] = [
  { id: 'all', label: 'All' },
  { id: 'holdings', label: 'Holdings' },
  { id: 'staking', label: 'Staking' },
  { id: 'governance', label: 'Governance' },
  { id: 'history', label: 'Tx History' },
];

function MyPageMainBase({ className }: MyPageMainProps) {
  const [tab, setTab] = useState<TabItem>(() => tabItems[0]);

  const showAll = useScreenSizeValue<boolean>({
    mobile: true,
    tablet: true,
    pc: false,
    monitor: false,
  });

  return (
    <MainLayout className={className}>
      <h1>
        <s>My Page</s>
      </h1>
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
      {(showAll || tab.id === 'all' || tab.id === 'history') && <History />}
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
