import { formatRate, formatUTokenDecimal2 } from '@nebula-js/notation';
import { Rate } from '@nebula-js/types';
import {
  breakpoints,
  DiffSpan,
  IconAndLabels,
  PartitionBarGraph,
  PartitionLabels,
  sectionStyle,
} from '@nebula-js/ui';
import { fixHMR } from 'fix-hmr';
import React, { DetailedHTMLProps } from 'react';
import styled from 'styled-components';
import useResizeObserver from 'use-resize-observer/polyfilled';
import { ClusterView } from '../../models/clusters';

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
            price,
            hr24,
            hr24diff,
            marketCap,
            volume,
            premium,
            totalProvided,
            assets,
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
              text={name}
              subtext={
                <>
                  {formatUTokenDecimal2(price)} UST{' '}
                  <DiffSpan
                    diff={hr24diff}
                    translateIconY={1}
                    style={{ fontSize: '0.85714286em' }}
                  >
                    {formatRate(hr24diff)}%
                  </DiffSpan>
                </>
              }
              iconSize="4.28571429em"
              textSize="1.42857143em"
              subtextSize="1em"
              textGap="0.2em"
            />

            <div className="values">
              <div>
                <h5>MARKET CAP</h5>
                <p>{formatUTokenDecimal2(marketCap)} UST</p>
              </div>

              <div>
                <h5>TOTAL PROVIDED</h5>
                <p>{formatUTokenDecimal2(totalProvided)} UST</p>
              </div>

              <div>
                <h5>PREMIUM</h5>
                <p>{formatRate(premium)}%</p>
              </div>

              <div>
                <h5>VOLUME</h5>
                <p>{formatUTokenDecimal2(volume)} UST</p>
              </div>
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
                height={8}
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
      background-color: var(--color-gray22);
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

    h5 {
      font-size: 12px;
      color: var(--color-white44);

      margin-bottom: 0.28571429em;
    }

    p {
      font-size: 1rem;
      color: var(--color-white92);
    }
  }

  @media (max-width: ${breakpoints.tablet.max}px) {
    grid-template-columns: 1fr;
  }
`;

export const ClustersCards = fixHMR(StyledClustersCards);
