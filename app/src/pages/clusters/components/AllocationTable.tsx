import React from 'react';
import {
  BarGraph,
  useScreenSizeValue,
  IconAndLabels,
  HorizontalScrollTable,
  Sub,
} from '@nebula-js/ui';
import { Rate } from '@nebula-js/types';
import { ClusterView } from '../models/types';
import styled from 'styled-components';
import {
  formatRate,
  formatUTokenDecimal2,
  formatUToken,
} from '@libs/formatter';
import { KeyboardArrowDown } from '@material-ui/icons';

interface AllocationTableProps {
  className?: string;
  clusterView: ClusterView;
}

function AllocationTableBase({ clusterView }: AllocationTableProps) {
  const tableMinWidth = useScreenSizeValue({
    mobile: 700,
    tablet: 1000,
    pc: 1000,
    monitor: 1000,
  });

  return (
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
              Value Weight
              <br />
              <span style={{ opacity: 0.6 }}>Current(+/- Target)</span>
            </span>
          </th>
          <th className="graph">
            <span>Value Target</span>
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
              <td>${formatUTokenDecimal2(marketcap)}</td>
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
              <td>
                <KeyboardArrowDown style={{ fontSize: '22px' }} />
              </td>
            </tr>
          ),
        )}
      </tbody>
    </Table>
  );
}

export const AllocationTable = styled(AllocationTableBase)``;

const Table = styled(HorizontalScrollTable)`
  margin-top: 16px;
  background-color: var(--color-gray3);
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
        border-bottom: 2px solid var(--color-gray2);
      }
    }
  }

  tbody {
    tr:not(:last-child) {
      td {
        border-bottom: 1px solid var(--color-gray2);
      }
    }
  }
`;
