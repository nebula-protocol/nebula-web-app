import {
  ArcElement,
  BarController,
  BarElement,
  BubbleController,
  CategoryScale,
  Chart,
  DoughnutController,
  Filler,
  Legend,
  LinearScale,
  LineController,
  LineElement,
  LogarithmicScale,
  PieController,
  PointElement,
  PolarAreaController,
  RadarController,
  RadialLinearScale,
  ScatterController,
  TimeScale,
  TimeSeriesScale,
  Title,
  Tooltip,
} from 'chart.js';
import { Header } from 'components/header';
import { DisableOverflowXStyle } from 'components/styles/DisableOverflowXStyle';
import { AppProviders } from 'configurations/app';
import React, { lazy, Suspense } from 'react';
import { render } from 'react-dom';
import { Redirect, Route, Switch } from 'react-router-dom';
import './polyfills/terra.polyfill';

Chart.register(
  ArcElement,
  LineElement,
  BarElement,
  PointElement,
  BarController,
  BubbleController,
  DoughnutController,
  LineController,
  PieController,
  PolarAreaController,
  RadarController,
  ScatterController,
  CategoryScale,
  LinearScale,
  LogarithmicScale,
  RadialLinearScale,
  TimeScale,
  TimeSeriesScale,
  Filler,
  Legend,
  Title,
  Tooltip,
);

const ClustersDetail = lazy(() => import('./pages/clusters/detail'));
const ClustersMain = lazy(() => import('./pages/clusters/main'));
const DashboardMain = lazy(() => import('./pages/dashboard/main'));
const GovMain = lazy(() => import('./pages/gov/main'));
const GovStake = lazy(() => import('./pages/gov/stake'));
const MyPageMain = lazy(() => import('./pages/mypage/main'));
const PollCreate = lazy(() => import('./pages/poll/create'));
const PollDetail = lazy(() => import('./pages/poll/detail'));
const PollMain = lazy(() => import('./pages/poll/main'));
const StakingMain = lazy(() => import('./pages/staking/main'));
const StakingStake = lazy(() => import('./pages/staking/stake'));

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
          <Route path="/staking/:item" component={StakingStake} />
          <Route path="/gov" component={GovMain} />
          <Route path="/gov/stake" component={GovStake} />
          <Route exact path="/poll" component={PollMain} />
          <Route path="/poll/create/:type" component={PollCreate} />
          <Route path="/poll/detail/:poll" component={PollDetail} />
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
