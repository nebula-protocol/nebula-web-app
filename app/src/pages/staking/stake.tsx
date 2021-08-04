import { HumanAddr } from '@nebula-js/types';
import { Section, Tab, TabItem } from '@nebula-js/ui';
import { useClusterInfoQuery } from '@nebula-js/webapp-provider';
import { FormLayout } from 'components/layouts/FormLayout';
import { fixHMR } from 'fix-hmr';
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
  extends RouteComponentProps<{ cluster: string }> {
  className?: string;
}

const tabItems: TabItem[] = [
  { id: 'stake', label: 'Stake' },
  { id: 'unstake', label: 'Unstake' },
];

function StakingStakeBase({ className, match, history }: StakingStakeProps) {
  const clusterAddr = match.params.cluster as HumanAddr;

  const { data: clusterInfo } = useClusterInfoQuery(clusterAddr);

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
      <Section className="main">
        <Switch>
          <Redirect exact path={`${match.url}/`} to={`${match.url}/stake`} />
          <Route path={`${match.url}/stake`}>
            {clusterInfo && <StakingStake clusterInfo={clusterInfo} />}
          </Route>
          <Route path={`${match.url}/unstake`}>
            {clusterInfo && <StakingUnstake clusterInfo={clusterInfo} />}
          </Route>
          <Redirect path={`${match.url}/*`} to={`${match.url}/stake`} />
        </Switch>
      </Section>
    </FormLayout>
  );
}

const StyledStakingStake = styled(StakingStakeBase)`
  .tab {
    margin-bottom: 1px;

    > li {
      &:first-child {
        border-bottom-left-radius: 0;
      }

      &:last-child {
        border-bottom-right-radius: 0;
      }
    }
  }

  .main {
    min-height: 200px;

    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }
`;

export default fixHMR(StyledStakingStake);
