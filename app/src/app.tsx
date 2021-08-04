import { Header } from 'components/header';
import { DisableOverflowXStyle } from 'components/styles/DisableOverflowXStyle';
import { AppProviders } from 'configurations/app';
import React, { Suspense } from 'react';
import { render } from 'react-dom';
import { Redirect, Route, Switch } from 'react-router-dom';
import './configurations/chartjs';
import ClustersDetail from './pages/clusters/detail';
import ClustersMain from './pages/clusters/main';
import DashboardMain from './pages/dashboard/main';
import GovMain from './pages/gov/main';
import GovStake from './pages/gov/stake';
import GovTrade from './pages/gov/trade';
import MyPageMain from './pages/mypage/main';
import PollCreate from './pages/poll/create';
import PollDetail from './pages/poll/detail';
import PollMain from './pages/poll/main';
import StakingMain from './pages/staking/main';
import StakingStake from './pages/staking/stake';
import { StyleRouterTest } from './pages/test/style-router-test';

function App() {
  return (
    <div>
      <Header />

      <Suspense fallback={<div>Loading...</div>}>
        <Switch>
          <Route exact path="/" component={DashboardMain} />
          <Route path="/my" component={MyPageMain} />
          <Route exact path="/clusters" component={ClustersMain} />
          <Route path="/clusters/:cluster" component={ClustersDetail} />
          <Route exact path="/staking" component={StakingMain} />
          <Route path="/staking/:cluster" component={StakingStake} />
          <Route exact path="/gov" component={GovMain} />
          <Route path="/gov/trade" component={GovTrade} />
          <Route path="/gov/stake" component={GovStake} />
          <Route exact path="/polls" component={PollMain} />
          <Route path="/polls/:type" component={PollCreate} />
          <Route path="/poll/:poll" component={PollDetail} />
          <Route path="/test/style-router" component={StyleRouterTest} />
          <Redirect to="/" />
        </Switch>
      </Suspense>
    </div>
  );
}

render(
  <AppProviders>
    <DisableOverflowXStyle />
    <App />
  </AppProviders>,
  document.querySelector('#root'),
);
