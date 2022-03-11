import { formatRate, formatToken, formatUTokenDecimal2 } from '@libs/formatter';
import { Rate } from '@nebula-js/types';
import {
  breakpoints,
  IconAndLabels,
  PartitionBarGraph,
  PartitionLabels,
  sectionStyle,
  VerticalLabelAndValue,
} from '@nebula-js/ui';
import { DisplayPremium } from 'components/common/DisplayPremium';
import { fixHMR } from 'fix-hmr';
import React, { DetailedHTMLProps } from 'react';
import styled from 'styled-components';
import useResizeObserver from 'use-resize-observer/polyfilled';
import { ClusterView } from '../models/clusters';

export interface ClustersCardsProps
  extends DetailedHTMLProps<
    React.HTMLAttributes<HTMLUListElement>,
    HTMLUListElement
  > {
  clusters: ClusterView[];
  onClusterClick: (id: string) => void;
}

function ClustersCardsBase({
  clusters,
  onClusterClick,
  ...sectionProps
}: ClustersCardsProps) {
  const { width = 400, ref } = useResizeObserver();

  return (
    <ul {...sectionProps}>
      {clusters.map(
        (
          {
            addr,
            name,
            prices,
            marketCap,
            provided,
            assets,
            isActive,
            tokenInfo,
          },
          i,
        ) => (
          <li
            key={'row' + addr}
            ref={i === 0 ? ref : undefined}
            role="button"
            onClick={() => onClusterClick(addr)}
          >
            <IconAndLabels
              symbol={tokenInfo.symbol}
              text={name}
              subtext={<>{formatToken(prices.clusterPrice)} UST </>}
              isActive={isActive}
              iconSize="4.28571429em"
              textSize="1.42857143em"
              subtextSize="1em"
              textGap="0.2em"
            />

            <div className="values">
              <VerticalLabelAndValue label="MARKET CAP">
                {formatUTokenDecimal2(marketCap)} UST
              </VerticalLabelAndValue>

              <VerticalLabelAndValue label="TOTAL PROVIDED">
                {formatUTokenDecimal2(provided)} UST
              </VerticalLabelAndValue>

              <VerticalLabelAndValue label="PREMIUM">
                <DisplayPremium
                  premium={prices.premium}
                  isColored={false}
                  showSign={false}
                />
              </VerticalLabelAndValue>
            </div>

            <Partition>
              <PartitionLabels
                columnGap="1em"
                data={assets
                  .slice(0, 2)
                  .map(({ token, color, portfolioRatio }) => ({
                    label: token.symbol,
                    color,
                    value: formatRate(portfolioRatio as Rate<number>) + '%',
                  }))}
              >
                {assets.length - 2 > 0 && <li>+{assets.length - 2} more</li>}
              </PartitionLabels>
              <PartitionBarGraph
                height={5}
                data={assets.map(({ color, portfolioRatio }) => ({
                  color,
                  value: portfolioRatio,
                }))}
                width={width}
              />
            </Partition>
          </li>
        ),
      )}
    </ul>
  );
}

const Partition = styled.div`
  margin-top: 2.85714286rem;

  ul {
    margin-bottom: 0.6em;
    font-size: 1rem;
  }
`;

export const StyledClustersCards = styled(ClustersCardsBase)`
  list-style: none;
  padding: 0;

  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.42857143em;

  > li {
    cursor: pointer;

    min-width: 0;

    ${sectionStyle};

    background-color: var(--color-gray14);

    &:hover {
      background-color: var(--color-gray18);
    }

    > button {
      display: block;
      width: 100%;
      text-align: unset;
    }
  }

  .values {
    margin-top: 3.42857143em;

    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1.71428571em;
  }

  @media (max-width: ${breakpoints.tablet.max}px) {
    grid-template-columns: 1fr;
  }
`;

export const ClustersCards = fixHMR(StyledClustersCards);
