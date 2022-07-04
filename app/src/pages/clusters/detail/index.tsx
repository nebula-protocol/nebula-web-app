import React, { useMemo } from 'react';
// import { useMediaQuery } from 'react-responsive';
import { fixHMR } from 'fix-hmr';
import styled from 'styled-components';
import { Redirect, Route, RouteComponentProps, Switch } from 'react-router-dom';
import { HumanAddr } from '@nebula-js/types';
import { useClusterInfoQuery } from '@nebula-js/app-provider';
import { ClusterHero } from '../components/Hero';
import { toClusterView } from '../models/clusters';
// import { breakpoints } from '@nebula-js/ui';
import { Overview as ClusterOverview } from '../Overview';

export interface ClustersDetailProps
  extends RouteComponentProps<{ cluster: string }> {
  className?: string;
}

function ClusterDetailBase({ match, history }: ClustersDetailProps) {
  // const isMobile = useMediaQuery({ maxWidth: breakpoints.tablet.max });

  const clusterAddr = match.params.cluster as HumanAddr;

  const { data: clusterInfo } = useClusterInfoQuery(clusterAddr);

  const clusterView = useMemo(() => {
    return clusterInfo ? toClusterView(clusterInfo) : undefined;
  }, [clusterInfo]);

  return (
    <>
      <ClusterHero match={match} history={history} clusterView={clusterView} />
      <section>
        <Switch>
          <Redirect exact path={`${match.url}/`} to={`${match.url}/buy`} />
          <Route path={`${match.url}/overview`}>
            {clusterView && <ClusterOverview clusterView={clusterView} />}
          </Route>
          <Route path={`${match.url}/get`}>{clusterInfo && <p>Get</p>}</Route>
          <Route path={`${match.url}/redeem`}>
            {clusterInfo && <p>Redeem</p>}
          </Route>
          <Route path={`${match.url}/arbitrage`}>
            {clusterInfo && <p>Arbitrage</p>}
          </Route>
          <Redirect path={`${match.url}/*`} to={`${match.url}/overview`} />
        </Switch>
      </section>
    </>
  );
}

const StyledClusterDetail = styled(ClusterDetailBase)``;

export default fixHMR(StyledClusterDetail);
