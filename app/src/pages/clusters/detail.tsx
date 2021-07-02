import { formatRate } from '@nebula-js/notation';
import { JSDateTime, Rate, uUST } from '@nebula-js/types';
import {
  BarGraph,
  breakpoints,
  Descriptions,
  DiffSpan,
  HorizontalScrollTable,
  IconAndLabels,
  PartitionBarGraph,
  PartitionLabel,
  PartitionLabels,
  Section,
  Sub,
  Tab,
  TabItem,
  TabSection,
  useScreenSizeValue,
} from '@nebula-js/ui';
import { MainLayout } from 'components/layouts/MainLayout';
import { fixHMR } from 'fix-hmr';
import React, { useCallback, useMemo, useState } from 'react';
import {
  Redirect,
  Route,
  RouteComponentProps,
  Switch,
  useRouteMatch,
} from 'react-router-dom';
import { useStyle } from 'style-router';
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

const colors = [
  '#23bed9',
  '#64a0bc',
  '#918ba8',
  '#ab7f9d',
  '#c37493',
  '#dc6887',
  '#f15e7e',
];

const partitionData = Array.from(
  { length: Math.floor(Math.random() * 4) + 4 },
  (_, i) => ({
    label: `ITEM${i}`,
    value: Math.floor(Math.random() * 1000) + 300,
    color: colors[i % colors.length],
  }),
);

const tableData = Array.from(
  { length: Math.floor(Math.random() * 10) + 5 },
  (_, i) => {
    return {
      index: i,
      id: `tokens-${i}`.toUpperCase(),
      name: `Mirror Protocol ${i}`,
      description: `MIR ${i}`,
      price: '102.01',
      hr24diff: (i % 3) - 1,
      hr24: '60.78',
      current: '50',
      target: '45',
      amount: '100,000.202293 MIR',
    };
  },
);

const chartData = Array.from(
  { length: Math.floor(Math.random() * 30) + 30 },
  (_, i) => {
    return {
      y: 10 * i + 10 - Math.random() * 20,
      amount: i.toString() as uUST,
      date: Date.now() as JSDateTime,
    };
  },
);

function ClustersDetailBase({
  className,
  match,
  history,
}: ClustersDetailProps) {
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

  const partitionLabels = useMemo<PartitionLabel[]>(() => {
    const total =
      partitionData.reduce((t, { value }) => t + value, 0) -
      partitionData.length;

    return partitionData.map(({ label, value, color }) => ({
      label,
      value: formatRate((value / total) as Rate<number>) + '%',
      color,
    }));
  }, []);

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
          text="New is always better"
          subtext={match.params.cluster}
          iconSize="1.5em"
          iconMarginRight="0.3em"
          subtextSize="0.4em"
          textGap="0.03em"
          style={{ fontSize: headingFontSize }}
        />
        <Descriptions
          direction={descriptionDisplay}
          descriptions={[
            { label: 'VOLUME (24H)', text: '123,456 UST' },
            { label: 'TOTAL SUPPLY', text: `123,456 ${match.params.cluster}` },
          ]}
        />
      </header>

      <section className="about">
        <Section>
          <article>
            <p>
              <b>The New is always better</b> index is a digital asset index
              designed to track the performance of 5 large cap US technology
              companies. The intent is to provide DeFi users with on-chain
              exposure to a basket of US large cap technology equities, as well
              as to showcase the composable nature of Mirror Protocol’s assets
              as building blocks for novel products.
            </p>
            <p>
              Mirror Protocol is a DeFi protocol powered by smart contracts on
              the Terra network that enables the creation of synthetic assets
              called mirrored assets (mAssets). mAssets mimic the price behavior
              of real-world assets and give traders anywhere in the world open
              access to price exposure without the burdens of owning or
              transacting real assets.
            </p>
            <p>
              Mirror democratizes access to the wealth creation of world markets
              that many financially disenfranchised users worldwide are
              precluded from -- unlocking the vast potential of dead capital.
              Mirror is entirely community-governed and relies on a siloed,
              CDP-style model for minting mAssets that trade on DeFi apps across
              Terra, Ethereum, Binance Chain, and soon to be more.
            </p>
          </article>

          <section className="graph" ref={ref}>
            <PartitionLabels data={partitionLabels} />
            <PartitionBarGraph data={partitionData} width={width} height={8} />
          </section>
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
              <Route path={`${match.url}/buy`} component={ClusterBuy} />
              <Route path={`${match.url}/sell`} component={ClusterSell} />
              <Route path={`${match.url}/mint`} component={ClusterMint} />
              <Route path={`${match.url}/burn`} component={ClusterBurn} />
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
              { label: 'TOTAL TOKEN PROVIDED', text: '123,456 UST' },
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
            {tableData.map(
              ({
                index,
                name,
                description,
                price,
                hr24,
                hr24diff,
                amount,
                current,
                target,
              }) => (
                <tr key={'row' + index}>
                  <td>
                    <IconAndLabels text={name} subtext={description} />
                  </td>
                  <td className="price">
                    {price} UST
                    <br />
                    <DiffSpan diff={hr24diff}>{hr24}%</DiffSpan>
                  </td>
                  <td>
                    {current}% <Sub>({target}%)</Sub>
                  </td>
                  <td className="graph">
                    <BarGraph ratio={Math.random()} width={300} height={8} />
                    <div>{amount}</div>
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
