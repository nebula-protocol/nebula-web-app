import { formatRate, formatToken, formatUTokenDecimal2 } from '@libs/formatter';
import {
  HorizontalScrollTable,
  HorizontalScrollTableProps,
  IconAndLabels,
  InfoTooltip,
  PartitionBarGraph,
  PartitionLabels,
  TwoLine,
  useScreenSizeValue,
} from '@nebula-js/ui';
import { fixHMR } from 'fix-hmr';
import React from 'react';
import styled from 'styled-components';
import { ClusterView } from '../models/clusters';

export interface ClustersTableProps
  extends Omit<HorizontalScrollTableProps, 'minWidth'> {
  clusters: ClusterView[];
  onClusterClick: (id: string) => void;
}

function ClustersTableBase({
  clusters,
  onClusterClick,
  ...tableProps
}: ClustersTableProps) {
  const tableMinWidth = useScreenSizeValue({
    mobile: 700,
    tablet: 1000,
    pc: 1000,
    monitor: 1000,
  });

  return (
    <HorizontalScrollTable {...tableProps} minWidth={tableMinWidth}>
      <thead>
        <tr>
          <th>
            <span>
              Cluster <InfoTooltip>Test tooltip...</InfoTooltip>
            </span>
          </th>
          <th>
            <span>
              Price <InfoTooltip>Test tooltip...</InfoTooltip>
            </span>
          </th>
          <th>
            <span>
              Market Cap <InfoTooltip>Test tooltip...</InfoTooltip>
            </span>
          </th>
          <th>
            <span>Total Provided</span>
          </th>
          <th>
            <span>Premium</span>
          </th>
          <th>
            <span>Volume</span>
          </th>
        </tr>
      </thead>

      <tbody>
        {clusters.map(
          ({
            addr,
            name,
            price,
            hr24diff,
            marketCap,
            volume,
            premium,
            totalProvided,
            assets,
          }) => (
            <tr key={'row' + addr} onClick={() => onClusterClick(addr)}>
              <td>
                <IconAndLabels
                  text={name}
                  subtext={
                    <Partition>
                      <PartitionBarGraph
                        height={5}
                        data={assets.map(({ color, portfolioRatio }) => ({
                          color,
                          value: portfolioRatio,
                        }))}
                        width={150}
                      />
                      <PartitionLabels
                        columnGap="0.5em"
                        data={assets.slice(0, 2).map(({ token, color }) => ({
                          label: token.symbol,
                          color,
                        }))}
                      >
                        {assets.length - 2 > 0 && (
                          <li>+{assets.length - 2} more</li>
                        )}
                      </PartitionLabels>
                    </Partition>
                  }
                  textGap="0.3em"
                />
              </td>
              <td>
                <TwoLine text={formatToken(price) + ' UST'} />
              </td>
              <td>{formatUTokenDecimal2(marketCap)} UST</td>
              <td>{formatUTokenDecimal2(totalProvided)} UST</td>
              <td>
                {premium.gt(0) && '+'}
                {formatRate(premium)}%
              </td>
              <td>
                <s>{formatUTokenDecimal2(volume)} UST</s>
              </td>
            </tr>
          ),
        )}
      </tbody>
    </HorizontalScrollTable>
  );
}

const Partition = styled.div`
  ul {
    margin-top: 5px;
    font-size: 12px;
  }
`;

export const StyledClustersTable = styled(ClustersTableBase)`
  background-color: var(--color-gray14);
  border-radius: 8px;

  td,
  th {
    text-align: right;

    &:first-child {
      text-align: left;
    }
  }

  td {
    svg {
      font-size: 1em;
      transform: translateY(2px);
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
    tr {
      cursor: pointer;

      transition: background-color 0.3s ease-in-out;

      &:hover {
        background-color: var(--color-gray18);
      }
    }

    tr:not(:last-child) {
      td {
        border-bottom: 1px solid var(--color-gray11);
      }
    }
  }
`;

export const ClustersTable = fixHMR(StyledClustersTable);
