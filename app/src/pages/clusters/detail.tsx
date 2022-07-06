import {
  formatRate,
  formatUTokenDecimal2,
  formatUToken,
} from '@libs/formatter';
import { HumanAddr, Rate, u, UST } from '@nebula-js/types';
import {
  BarGraph,
  breakpoints,
  Descriptions,
  HorizontalScrollTable,
  IconAndLabels,
  InfoTooltip,
  Section,
  Sub,
  Tab,
  TabItem,
  useScreenSizeValue,
} from '@nebula-js/ui';
import { useClusterInfoQuery, useLunaPrice } from '@nebula-js/app-provider';
import { MainLayout } from 'components/layouts/MainLayout';
import { fixHMR } from 'fix-hmr';
import { toClusterView } from 'pages/clusters/models/clusters';
import React, { useCallback, useMemo } from 'react';
import {
  Redirect,
  Route,
  RouteComponentProps,
  Switch,
  useRouteMatch,
} from 'react-router-dom';
import styled from 'styled-components';
import { ClusterBurn } from './components/Burn';
import { ClusterBuy } from './components/Buy';
import { ClusterMint } from './components/Mint';
import { PriceCard } from './components/PriceCard';
import { ClusterSell } from './components/Sell';
import { useTwoSteps } from 'contexts/two-steps';
import { Big } from 'big.js';

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

function ClustersDetailBase({
  className,
  match,
  history,
}: ClustersDetailProps) {
  const clusterAddr = match.params.cluster as HumanAddr;

  const { data: clusterInfo } = useClusterInfoQuery(clusterAddr);

  const lunaPrice = useLunaPrice();

  const { validateAndNavigate } = useTwoSteps();

  const clusterView = useMemo(() => {
    return clusterInfo ? toClusterView(clusterInfo) : undefined;
  }, [clusterInfo]);

  const netAssetValue = useMemo(() => {
    return clusterView && lunaPrice
      ? (clusterView.provided.mul(lunaPrice) as u<UST<Big>>)
      : undefined;
  }, [clusterView, lunaPrice]);

  const pageMatch = useRouteMatch<{ page: string }>(`${match.url}/:page`);

  const tab = useMemo<TabItem | undefined>(() => {
    return tabItems.find(({ id }) => id === pageMatch?.params.page);
  }, [pageMatch?.params.page]);

  const tabChange = useCallback(
    (nextTab: TabItem) => {
      const navigate = () =>
        history.push({
          pathname: `${match.url}/${nextTab.id}`,
        });

      validateAndNavigate(navigate);
    },
    [history, match.url, validateAndNavigate],
  );

  const descriptionDisplay = useScreenSizeValue<'horizontal' | 'vertical'>({
    mobile: 'vertical',
    tablet: 'horizontal',
    pc: 'vertical',
    monitor: 'horizontal',
  });

  const headingFontSize = useScreenSizeValue<`${number}rem`>({
    mobile: '1.9rem',
    tablet: '2rem',
    pc: '2.3rem',
    monitor: '2.3rem',
  });

  const tableMinWidth = useScreenSizeValue({
    mobile: 700,
    tablet: 1000,
    pc: 1000,
    monitor: 1000,
  });

  return (
    <MainLayout className={className}>
      <header className="header">
        <IconAndLabels
          symbol={clusterView?.tokenInfo.symbol}
          text={clusterView?.name ?? '-'}
          subtext={clusterView?.tokenInfo.symbol ?? '-'}
          iconSize="1.5em"
          iconMarginRight="0.3em"
          subtextSize="0.4em"
          textGap="0.03em"
          style={{ fontSize: headingFontSize }}
        />
        <Descriptions
          direction={descriptionDisplay}
          descriptions={[
            {
              label: 'TOTAL SUPPLY',
              text: `${
                clusterView
                  ? formatUTokenDecimal2(clusterView.totalSupply)
                  : '0'
              } ${clusterView?.tokenInfo.symbol ?? '-'}`,
            },
          ]}
        />
      </header>

      <section className="main">
        <div>
          <MainTab
            className="tab"
            items={tabItems}
            selectedItem={tab ?? tabItems[0]}
            onChange={tabChange}
          />
          <MainSection>
            <Switch>
              <Redirect exact path={`${match.url}/`} to={`${match.url}/buy`} />
              <Route path={`${match.url}/buy`}>
                {clusterInfo && <ClusterBuy clusterInfo={clusterInfo} />}
              </Route>
              <Route path={`${match.url}/sell`}>
                {clusterInfo && <ClusterSell clusterInfo={clusterInfo} />}
              </Route>
              <Route path={`${match.url}/mint`}>
                {clusterInfo && <ClusterMint clusterInfo={clusterInfo} />}
              </Route>
              <Route path={`${match.url}/burn`}>
                {clusterInfo && <ClusterBurn clusterInfo={clusterInfo} />}
              </Route>
              <Redirect path={`${match.url}/*`} to={`${match.url}/buy`} />
            </Switch>
          </MainSection>
        </div>

        <PriceCard
          prices={clusterView?.prices}
          liquidity={clusterView?.liquidity}
          desc={clusterView?.description}
        />
      </section>

      <section className="provided-tokens">
        <header>
          <h2>Cluster Inventory</h2>
          <Descriptions
            direction={descriptionDisplay}
            descriptions={[
              {
                label: (
                  <>
                    NET ASSET VALUE{' '}
                    <InfoTooltip>
                      Total value of the cluster’s inventory
                    </InfoTooltip>
                  </>
                ),
                text: netAssetValue
                  ? '$' + formatUTokenDecimal2(netAssetValue)
                  : '-',
              },
            ]}
          />
        </header>

        <Table minWidth={tableMinWidth}>
          <thead>
            <tr>
              <th>
                <span>Tokens</span>
              </th>
              <th>
                <span>Supplied in Inventory</span>
              </th>
              <th>
                <span>Value in inventory</span>
              </th>
              <th className="portfolio-ratio">
                <span>
                  Asset Weight
                  <br />
                  <span style={{ opacity: 0.6 }}>Current(+/- Target)</span>
                </span>
              </th>
              <th className="graph">
                <span>Premium</span>
              </th>
            </tr>
          </thead>

          <tbody>
            {clusterView?.assets.map(
              ({
                amount,
                token,
                marketcap,
                portfolioRatio,
                targetRatio,
                diff,
                diffColor,
              }) => (
                <tr key={'row' + token.symbol}>
                  <td>
                    <IconAndLabels
                      symbol={token.symbol}
                      text={token.name}
                      subtext={token.symbol}
                    />
                  </td>
                  <td>
                    {formatUToken(amount)} {token.symbol}
                  </td>
                  <td>
                    $
                    {lunaPrice
                      ? formatUTokenDecimal2(
                          lunaPrice.mul(marketcap) as u<UST<Big>>,
                        )
                      : '-'}
                  </td>
                  <td className="portfolio-ratio">
                    {formatRate(portfolioRatio as Rate<number>)}%{' '}
                    <Sub
                      style={{
                        color: diffColor,
                      }}
                    >
                      ({formatRate(diff as Rate<number>)}%)
                    </Sub>
                  </td>
                  <td className="graph">
                    <BarGraph
                      portfolioRatio={portfolioRatio}
                      targetRatio={targetRatio}
                    />
                  </td>
                </tr>
              ),
            )}
          </tbody>
        </Table>
      </section>
    </MainLayout>
  );
}

const MainTab = styled(Tab)`
  > li {
    &:first-child {
      border-bottom-left-radius: 0;
    }

    &:last-child {
      border-bottom-right-radius: 0;
    }
  }
`;

const MainSection = styled(Section)`
  min-height: 200px;

  background-color: var(--color-gray18);

  border-top-left-radius: 0;
  border-top-right-radius: 0;
`;

const Table = styled(HorizontalScrollTable)`
  background-color: var(--color-gray14);
  border-radius: 8px;

  td,
  th {
    text-align: right;

    &:first-child,
    &:last-child {
      text-align: left;
    }
  }

  td:not(.graph) {
    svg {
      font-size: 1em;
      transform: translateY(2px);
    }
  }

  td.price {
    span {
      font-size: var(--font-size12);
    }
  }

  th.graph,
  td.graph {
    text-align: left;
    padding-left: 3em !important;

    > div {
      font-size: var(--font-size12);
    }
  }

  thead {
    tr {
      th {
        border-bottom: 2px solid var(--color-gray11);
      }
    }
  }

  tbody {
    tr:not(:last-child) {
      td {
        border-bottom: 1px solid var(--color-gray11);
      }
    }
  }
`;

const StyledClustersDetail = styled(ClustersDetailBase)`
  .header {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;

    margin-bottom: 24px;
  }

  .about {
    p {
      line-height: 1.5em;
      font-size: 1.1em;
      font-weight: 400;

      &:not(:last-child) {
        margin-bottom: 1.2em;
      }
    }

    .graph {
      margin-top: 4.2em;

      > :first-child {
        margin-bottom: 0.5em;
      }
    }

    margin-bottom: 40px;
  }

  .main {
    width: 100%;

    display: flex;
    gap: 1.3em;

    > :first-child {
      flex: 1;

      .tab {
        margin-bottom: 1px;
      }
    }

    > :last-child {
      width: 422px;
      align-self: flex-start;
    }
  }

  .provided-tokens {
    header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;

      margin: 3.5em 0 1em 0;
    }
  }

  @media (max-width: ${1000}px) {
    .main {
      flex-direction: column;

      > :last-child {
        width: 100%;
      }
    }
  }

  @media (max-width: ${breakpoints.tablet.max}px) {
    .header {
      flex-direction: column;
      gap: 1em;
      align-items: flex-start;

      margin-bottom: 20px;
    }

    .provided-tokens,
    .about {
      header {
        flex-direction: column;
        gap: 0.7em;
        align-items: flex-start;
      }
    }
  }

  @media (max-width: ${breakpoints.mobile.max}px) {
    .header {
      > :last-child {
        width: 100%;
      }
    }

    .provided-tokens {
      header {
        > :last-child {
          width: 100%;
        }
      }
    }
  }
`;

export default fixHMR(StyledClustersDetail);
