import { formatRate, formatUTokenWithPostfixUnits } from '@libs/formatter';
import { ChevronRight } from '@material-ui/icons';
import {
  ClusterInfo,
  computeMarketCap,
  computeProvided,
} from '@nebula-js/app-fns';
import { useClustersInfoListQuery } from '@nebula-js/app-provider';
import { Rate, u, UST } from '@nebula-js/types';
import {
  Carousel,
  DiffSpan,
  InfoTooltip,
  MiniTab,
  PartitionBarGraph,
  PartitionLabels,
  useScreenSizeValue,
  VerticalLabelAndValue,
} from '@nebula-js/ui';
import { Big } from 'big.js';
import { ClusterView, toClusterView } from 'pages/clusters/models/clusters';
import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import useResizeObserver from 'use-resize-observer/polyfilled';

interface TopCluster extends ClusterInfo {
  marketCap: u<UST<Big>>;
  provided: u<UST<Big>>;
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
        const marketCap = computeMarketCap(
          clusterInfo.clusterState,
          clusterInfo.terraswapPool,
        ) as u<UST<Big>>;

        return { ...clusterInfo, marketCap };
      })
      .sort((a, b) => {
        return b.marketCap.minus(a.marketCap).toNumber();
      })
      .slice(0, 3)
      .map((clusterInfo) => {
        const provided = computeProvided(clusterInfo.clusterState);
        const view = toClusterView(clusterInfo);

        return {
          ...clusterInfo,
          provided,
          view,
        };
      });
  }, [clusterInfos]);

  const tabItems = useMemo(() => {
    return topClusters.map((_, i) => {
      return { id: i.toString(), label: i.toString() };
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
              marketCap,
              provided,
              view: { assets },
            },
            i,
          ) => (
            <Content key={'cluster' + i}>
              <section className="summary">
                <i />
                <div>
                  <h4>
                    <Link
                      to={`/clusters/${clusterState.cluster_contract_address}`}
                    >
                      {clusterTokenInfo.name} <ChevronRight />
                    </Link>
                  </h4>
                  <p>
                    {formatUTokenWithPostfixUnits(marketCap)} UST{' '}
                    <s>
                      <DiffSpan
                        diff={10}
                        translateIconY="0.15em"
                        style={{ fontSize: 12 }}
                      >
                        10.00%
                      </DiffSpan>
                    </s>
                  </p>
                </div>
              </section>

              <VerticalLabelAndValue
                className="provided-asset"
                label={
                  <>
                    PROVIDED ASSET <InfoTooltip>Test tooltip...</InfoTooltip>
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

    i {
      width: 4em;
      height: 4em;
      background-color: var(--color-gray34);
      border-radius: 50%;
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
