import { formatRate, formatUTokenDecimal2 } from '@nebula-js/notation';
import {
  DiffSpan,
  HorizontalScrollTable,
  HorizontalScrollTableProps,
  IconAndLabels,
  PartitionBarGraph,
  PartitionLabels,
  TwoLine,
  useScreenSizeValue,
} from '@nebula-js/ui';
import { fixHMR } from 'fix-hmr';
import React from 'react';
import styled from 'styled-components';
import { ClustersListItem } from '../../models/clusters';

export interface ClustersTableProps
  extends Omit<HorizontalScrollTableProps, 'minWidth'> {
  listItems: ClustersListItem[];
  onClusterClick: (id: string) => void;
}

function ClustersTableBase({
  listItems,
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
            <span>Cluster</span>
          </th>
          <th>
            <span>Price</span>
          </th>
          <th>
            <span>Market Cap</span>
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
        {listItems.map(
          ({
            index,
            id,
            name,
            price,
            hr24diff,
            marketCap,
            volume,
            premium,
            totalProvided,
            assets,
          }) => (
            <tr key={'row' + index} onClick={() => onClusterClick(id)}>
              <td>
                <IconAndLabels
                  text={name}
                  subtext={
                    <Partition>
                      <PartitionBarGraph height={8} data={assets} width={150} />
                      <PartitionLabels
                        columnGap="0.5em"
                        data={assets
                          .slice(0, 2)
                          .map(({ label, color }) => ({ label, color }))}
                      >
                        {assets.length - 2 > 0 && (
                          <li>+{assets.length - 2} more</li>
                        )}
                      </PartitionLabels>
                    </Partition>
                  }
                  textGap="0.4em"
                />
              </td>
              <td>
                <TwoLine
                  text={formatUTokenDecimal2(price) + ' UST'}
                  subText={
                    <DiffSpan diff={hr24diff}>{formatRate(hr24diff)}%</DiffSpan>
                  }
                />
              </td>
              <td>{formatUTokenDecimal2(marketCap)} UST</td>
              <td>{formatUTokenDecimal2(totalProvided)} UST</td>
              <td>
                {premium.gt(0) && '+'}
                {formatRate(premium)}%
              </td>
              <td>{formatUTokenDecimal2(volume)} UST</td>
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
        background-color: var(--color-gray22);
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
