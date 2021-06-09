import { Section, Tab, TabItem } from '@nebula-js/ui';
import { MainLayout } from 'components/layouts/MainLayout';
import React, { useState } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import styled from 'styled-components';

export interface ClustersDetailProps
  extends RouteComponentProps<{ cluster: string }> {
  className?: string;
}

const tabItems: TabItem[] = [
  { id: 'buy', label: 'Buy' },
  { id: 'sell', label: 'Sell' },
  { id: 'mint', label: 'Mint' },
  { id: 'burn', label: 'Burn' },
];

function ClustersDetailBase({ className, match }: ClustersDetailProps) {
  const [tab, setTab] = useState<TabItem>(tabItems[0]);

  return (
    <MainLayout className={className}>
      <header>
        <div>
          <i />
          <h1>New is always better</h1>
          <p>{match.params.cluster}</p>
        </div>
        <div>
          <div>
            <span>VOLUME (24H)</span>
            <span>123,456 UST</span>
          </div>
          <div>
            <span>TOTAL SUPPLY</span>
            <span>123,456 {match.params.cluster}</span>
          </div>
        </div>
      </header>

      <section>
        <Tab items={tabItems} selectedItem={tab} onChange={setTab} />

        <Section></Section>
      </section>
    </MainLayout>
  );
}

export default styled(ClustersDetailBase)`
  // TODO
`;
