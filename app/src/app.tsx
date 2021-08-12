import { Header } from 'components/header';
import { DisableOverflowXStyle } from 'components/styles/DisableOverflowXStyle';
import { AppProviders } from 'configurations/app';
import 'configurations/chartjs';
import ClustersDetail from 'pages/clusters/detail';
import ClustersMain from 'pages/clusters/main';
import DashboardMain from 'pages/dashboard/main';
import GovMain from 'pages/gov/main';
import GovStake from 'pages/gov/stake';
import GovTrade from 'pages/gov/trade';
import MyPageMain from 'pages/mypage/main';
import PollBlacklistCluster from 'pages/poll/components/PollBlacklistCluster';
import PollClusterParameterChange from 'pages/poll/components/PollClusterParameterChange';
import PollCommunityPoolSpend from 'pages/poll/components/PollCommunityPoolSpend';
import PollGovernanceParameterChange from 'pages/poll/components/PollGovernanceParameterChange';
import PollText from 'pages/poll/components/PollText';
import PollWhitelistCluster from 'pages/poll/components/PollWhitelistCluster';
import PollDetail from 'pages/poll/detail';
import PollMain from 'pages/poll/main';
import Send from 'pages/send/main';
import StakingMain from 'pages/staking/main';
import StakingStake from 'pages/staking/stake';
import { StyleRouterTest } from 'pages/test/style-router-test';
import React, { Suspense } from 'react';
import { render } from 'react-dom';
import { Redirect, Route, Switch } from 'react-router-dom';

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
          <Route path="/staking/:token" component={StakingStake} />
          <Route exact path="/gov" component={GovMain} />
          <Route path="/gov/trade" component={GovTrade} />
          <Route path="/gov/stake" component={GovStake} />
          <Route exact path="/polls" component={PollMain} />
          <Route
            path="/polls/create/whitelist-cluster"
            component={PollWhitelistCluster}
          />
          <Route
            path="/polls/create/blacklist-cluster"
            component={PollBlacklistCluster}
          />
          <Route
            path="/polls/create/cluster-parameter-change"
            component={PollClusterParameterChange}
          />
          <Route
            path="/polls/create/governance-parameter-change"
            component={PollGovernanceParameterChange}
          />
          <Route
            path="/polls/create/community-pool-spend"
            component={PollCommunityPoolSpend}
          />
          <Route path="/polls/create/text" component={PollText} />
          <Route path="/poll/:poll" component={PollDetail} />
          <Route path="/send" component={Send} />
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
