import { Section, Tab, TabItem } from '@nebula-js/ui';
import { FormLayout } from 'components/layouts/FormLayout';
import React, { useCallback, useMemo } from 'react';
import {
  Redirect,
  Route,
  RouteComponentProps,
  Switch,
  useRouteMatch,
} from 'react-router-dom';
import styled from 'styled-components';
import { StakingStake } from './components/Stake';
import { StakingUnstake } from './components/Unstake';

export interface StakingStakeProps
  extends RouteComponentProps<{ item: string }> {
  className?: string;
}

const tabItems: TabItem[] = [
  { id: 'stake', label: 'Stake' },
  { id: 'unstake', label: 'Unstake' },
];

function StakingStakeBase({ className, match, history }: StakingStakeProps) {
  const pageMatch = useRouteMatch<{ page: string }>(`${match.url}/:page`);

  const tab = useMemo<TabItem | undefined>(() => {
    return tabItems.find(({ id }) => id === pageMatch?.params.page);
  }, [pageMatch?.params.page]);

  const tabChange = useCallback(
    (nextTab: TabItem) => {
      history.push({
        pathname: `${match.url}/${nextTab.id}`,
      });
    },
    [history, match.url],
  );

  return (
    <FormLayout className={className} title="Stake">
      <Tab
        className="tab"
        items={tabItems}
        selectedItem={tab ?? tabItems[0]}
        onChange={tabChange}
      />
      <Section style={{ minHeight: 200 }}>
        <Switch>
          <Redirect exact path={`${match.url}/`} to={`${match.url}/stake`} />
          <Route path={`${match.url}/stake`} component={StakingStake} />
          <Route path={`${match.url}/unstake`} component={StakingUnstake} />
          <Redirect path={`${match.url}/*`} to={`${match.url}/stake`} />
        </Switch>
      </Section>
    </FormLayout>
  );
}

export default styled(StakingStakeBase)`
  .tab {
    margin-bottom: 1.2em;
  }
`;
