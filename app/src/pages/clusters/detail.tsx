import { formatRate, formatUTokenDecimal2 } from '@libs/formatter';
import { HumanAddr, JSDateTime, Rate, u, UST } from '@nebula-js/types';
import {
  BarGraph,
  breakpoints,
  Descriptions,
  DiffSpan,
  HorizontalScrollTable,
  IconAndLabels,
  PartitionBarGraph,
  PartitionLabels,
  Section,
  Sub,
  Tab,
  TabItem,
  TabSection,
  useScreenSizeValue,
} from '@nebula-js/ui';
import { useClusterInfoQuery } from '@nebula-js/app-provider';
import { MainLayout } from 'components/layouts/MainLayout';
import { fixHMR } from 'fix-hmr';
import { toClusterView } from 'pages/clusters/models/clusters';
import React, { useCallback, useMemo, useState } from 'react';
import {
  Redirect,
  Route,
  RouteComponentProps,
  Switch,
  useRouteMatch,
} from 'react-router-dom';
import { useStyle } from '@libs/style-router';
import styled from 'styled-components';
import useResizeObserver from 'use-resize-observer/polyfilled';
import { ClusterBurn } from './components/Burn';
import { ClusterBuy } from './components/Buy';
import { ClusterMint } from './components/Mint';
import { PriceChart } from './components/PriceChart';
import { ClusterSell } from './components/Sell';

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

const chartTabItems: TabItem[] = [
  { id: 'day', label: 'D' },
  { id: 'week', label: 'W' },
  { id: 'month', label: 'M' },
  { id: 'year', label: 'Y' },
];

const chartData = Array.from(
  { length: Math.floor(Math.random() * 30) + 30 },
  (_, i) => {
    return {
      y: 10 * i + 10 - Math.random() * 20,
      amount: i.toString() as u<UST>,
      date: Date.now() as JSDateTime,
    };
  },
);

function ClustersDetailBase({
  className,
  match,
  history,
}: ClustersDetailProps) {
  const clusterAddr = match.params.cluster as HumanAddr;

  const { data: clusterInfo } = useClusterInfoQuery(clusterAddr);

  const clusterView = useMemo(() => {
    return clusterInfo ? toClusterView(clusterInfo) : undefined;
  }, [clusterInfo]);

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

  const { width = 300, ref } = useResizeObserver();

  const { color } = useStyle();

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

  const [chartTab, setChartTab] = useState<TabItem>(chartTabItems[0]);

  return (
    <MainLayout className={className}>
      <header className="header">
        <IconAndLabels
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
              label: 'VOLUME (24H)',
              text: `${
                clusterView?.volume
                  ? formatUTokenDecimal2(clusterView.volume)
                  : 0
              } UST`,
            },
            {
              label: 'TOTAL SUPPLY',
              text: <s>123,456 {clusterView?.tokenInfo.symbol ?? '-'}</s>,
            },
          ]}
        />
      </header>

      <section className="about">
        <Section>
          <article>
            <p>{clusterView?.description}</p>
          </article>

          {clusterView?.assets && (
            <section className="graph" ref={ref}>
              <PartitionLabels
                data={clusterView.assets
                  .slice(0, 5)
                  .map(({ token, color: assetColor, portfolioRatio }) => ({
                    label: token.symbol,
                    color: assetColor,
                    value: formatRate(portfolioRatio as Rate<number>) + '%',
                  }))}
              >
                {clusterView.assets.length - 5 > 0 && (
                  <li>+{clusterView.assets.length - 5} more</li>
                )}
              </PartitionLabels>
              <PartitionBarGraph
                data={clusterView.assets.map(
                  ({ color: assetColor, portfolioRatio }) => ({
                    color: assetColor,
                    value: portfolioRatio,
                  }),
                )}
                width={width}
                height={8}
              />
            </section>
          )}
        </Section>
      </section>

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

        <TabSection
          emptyMain
          items={chartTabItems}
          selectedItem={chartTab}
          onChange={setChartTab}
        >
          <PriceChart data={chartData} color={color} />
        </TabSection>
      </section>

      <section className="provided-tokens">
        <header>
          <h2>Provided Tokens</h2>
          <Descriptions
            direction={descriptionDisplay}
            descriptions={[
              {
                label: 'TOTAL TOKEN PROVIDED',
                text:
                  (clusterView?.totalProvided
                    ? formatUTokenDecimal2(clusterView.totalProvided)
                    : '0') + ' UST',
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
                <span>Price</span>
              </th>
              <th>
                <span>
                  Portfolio Ratio
                  <br />
                  <span style={{ opacity: 0.6 }}>Current (Target)</span>
                </span>
              </th>
              <th />
            </tr>
          </thead>

          <tbody>
            {clusterView?.assets.map(({ token, portfolioRatio }) => (
              <tr key={'row' + token.symbol}>
                <td>
                  <IconAndLabels text={token.name} subtext={token.symbol} />
                </td>
                <td className="price">
                  <s>
                    0 UST
                    <br />
                    <DiffSpan diff={0.5}>0%</DiffSpan>
                  </s>
                </td>
                <td>
                  {formatRate(portfolioRatio as Rate<number>)}%{' '}
                  <Sub>
                    <s>({0}%)</s>
                  </Sub>
                </td>
                <td className="graph">
                  <BarGraph ratio={Math.random()} width={300} height={8} />
                  <div>
                    <s>100,000</s> {token.symbol}
                  </div>
                </td>
              </tr>
            ))}
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

  border-top-left-radius: 0;
  border-top-right-radius: 0;
`;

const Table = styled(HorizontalScrollTable)`
  background-color: var(--color-gray14);
  border-radius: 8px;

  td,
  th {
    text-align: right;

    &:first-child {
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

  td.graph {
    text-align: left;
    padding-left: 4em !important;

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
