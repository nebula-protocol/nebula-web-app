import { formatRate, formatUTokenWithPostfixUnits } from '@libs/formatter';
import { ChevronRight } from '@material-ui/icons';
import { ClusterInfo } from '@nebula-js/app-fns';
import { useClustersInfoListQuery } from '@nebula-js/app-provider';
import { Rate } from '@nebula-js/types';
import {
  Carousel,
  InfoTooltip,
  MiniTab,
  PartitionBarGraph,
  PartitionLabels,
  TokenIcon,
  useScreenSizeValue,
  VerticalLabelAndValue,
} from '@nebula-js/ui';
import { ClusterView, toClusterView } from 'pages/clusters/models/clusters';
import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import useResizeObserver from 'use-resize-observer/polyfilled';

interface TopCluster extends ClusterInfo {
  view: ClusterView;
}

export interface TopClustersProps {
  className?: string;
}

function TopClustersBase({ className }: TopClustersProps) {
  const [slide, setSlide] = useState<number>(0);

  const { data: clusterInfos = [] } = useClustersInfoListQuery();

  const maxShowLabels = useScreenSizeValue({
    monitor: 3,
    pc: 3,
    tablet: 3,
    mobile: 2,
  });

  const topClusters = useMemo<TopCluster[]>(() => {
    return clusterInfos
      .map((clusterInfo) => {
        const view = toClusterView(clusterInfo);

        return { ...clusterInfo, view };
      })
      .sort((a, b) => {
        return b.view.marketCap.minus(a.view.marketCap).toNumber();
      })
      .slice(0, 3);
  }, [clusterInfos]);

  const tabItems = useMemo(() => {
    return topClusters.map((_, i) => {
      const label = (i + 1).toString();
      return { id: i.toString(), label };
    });
  }, [topClusters]);

  const { width = 300, ref } = useResizeObserver();

  return (
    <div className={className} ref={ref}>
      <Carousel slide={slide}>
        {topClusters.map(
          (
            {
              clusterState,
              clusterTokenInfo,
              view: { assets, marketCap, provided },
            },
            i,
          ) => (
            <Content key={'cluster' + i}>
              <section className="summary">
                <TokenIcon symbol={clusterTokenInfo.symbol} />
                <div>
                  <h4>
                    <Link
                      to={`/clusters/${clusterState.cluster_contract_address}`}
                    >
                      {clusterTokenInfo.name} <ChevronRight />
                    </Link>
                  </h4>
                  <p>{clusterTokenInfo.symbol}</p>
                </div>
              </section>

              <VerticalLabelAndValue
                className="marketcap-asset"
                label={
                  <>
                    MARKET CAP{' '}
                    <InfoTooltip>
                      Cluster market cap. Calculated from the cluster’s market
                      price and total supply
                    </InfoTooltip>
                  </>
                }
              >
                {formatUTokenWithPostfixUnits(marketCap)} UST
              </VerticalLabelAndValue>

              <VerticalLabelAndValue
                className="provided-asset"
                label={
                  <>
                    PROVIDED ASSET{' '}
                    <InfoTooltip>
                      Total value of the cluster’s inventory
                    </InfoTooltip>
                  </>
                }
              >
                {formatUTokenWithPostfixUnits(provided)} UST
              </VerticalLabelAndValue>

              <VerticalLabelAndValue className="supply" label="SUPPLY">
                {formatUTokenWithPostfixUnits(
                  clusterState.outstanding_balance_tokens,
                )}{' '}
                {clusterTokenInfo.symbol}
              </VerticalLabelAndValue>

              <section className="graph">
                <PartitionLabels
                  data={assets
                    .slice(0, maxShowLabels)
                    .map(({ token, color, portfolioRatio }) => ({
                      label: token.symbol,
                      color,
                      value: formatRate(portfolioRatio as Rate<number>) + '%',
                    }))}
                >
                  {assets.length - maxShowLabels > 0 && (
                    <li className="more">
                      +{assets.length - maxShowLabels} more
                    </li>
                  )}
                </PartitionLabels>
                <PartitionBarGraph
                  data={assets.map(({ color, portfolioRatio }) => ({
                    color,
                    value: portfolioRatio,
                  }))}
                  width={width}
                  height={5}
                />
              </section>
            </Content>
          ),
        )}
      </Carousel>

      <MiniTab
        className="tab"
        items={tabItems}
        selectedItem={tabItems[slide]}
        onChange={(nextTab) =>
          setSlide(
            tabItems.findIndex((tabItem) => tabItem.id === nextTab.id) ?? 0,
          )
        }
      />
    </div>
  );
}

const Content = styled.div`
  > .summary {
    display: flex;
    align-items: center;

    img {
      width: 4em;
      height: 4em;
      margin-right: 1em;
    }

    h4 {
      font-size: var(--font-size20);

      a {
        text-decoration: none;
        color: inherit;
      }

      svg {
        font-size: 0.8em;
      }

      margin-bottom: 0.28571429em;
    }

    p:nth-child(2) {
      color: var(--color-white44);
    }

    p:nth-child(3) {
      font-size: var(--font-size12);
    }

    margin-bottom: 4em;
  }

  > .marketcap-asset,
  > .provided-asset,
  > .supply {
    margin-bottom: 1.5em;
  }

  > .graph {
    margin-top: 3em;

    .more {
      color: var(--color-white64);
    }
  }
`;

export const TopClusters = styled(TopClustersBase)`
  position: relative;

  .tab {
    position: absolute;
    top: -55px;
    right: 0;

    > li {
      width: 32px;
    }
  }
`;
