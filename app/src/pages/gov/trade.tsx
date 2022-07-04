import { Section, Tab, TabItem } from '@nebula-js/ui';
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
import { Buy } from './components/Buy';
import { Sell } from './components/Sell';

export interface TradeProps extends RouteComponentProps {
  className?: string;
}

const tabItems: TabItem[] = [
  { id: 'buy', label: 'Buy' },
  { id: 'sell', label: 'Sell' },
];

function TradeBase({ className, match, history }: TradeProps) {
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
    <FormLayout className={className} title="Trade NEB">
      <Tab
        className="tab"
        items={tabItems}
        selectedItem={tab ?? tabItems[0]}
        onChange={tabChange}
      />
      <Section className="main">
        <Switch>
          <Redirect exact path={`${match.url}/`} to={`${match.url}/buy`} />
          <Route path={`${match.url}/buy`} component={Buy} />
          <Route path={`${match.url}/sell`} component={Sell} />
          <Redirect path={`${match.url}/*`} to={`${match.url}/buy`} />
        </Switch>
      </Section>
    </FormLayout>
  );
}

export const StyledTrade = styled(TradeBase)`
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
    background-color: var(--color-gray4);

    min-height: 200px;

    border-top-left-radius: 0;
    border-top-right-radius: 0;
  }
`;

export default fixHMR(StyledTrade);
