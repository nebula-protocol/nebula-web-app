import { formatRate, formatUTokenWithPostfixUnits } from '@libs/formatter';
import {
  Button,
  CoupledIconsHolder,
  HorizontalScrollTable,
  HorizontalScrollTableProps,
  TokenIcon,
  useScreenSizeValue,
} from '@nebula-js/ui';
import { DelistedBadge } from '@nebula-js/ui/text/DelistedBadge';
import { fixHMR } from 'fix-hmr';
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { StakingView } from '../models/staking';

export interface StakingTableProps
  extends Omit<HorizontalScrollTableProps, 'minWidth'> {
  className?: string;
  staking: StakingView;
}

function StakingTableBase({ staking, ...tableProps }: StakingTableProps) {
  const buttonSize = useScreenSizeValue<'small' | 'tiny'>({
    mobile: 'tiny',
    tablet: 'small',
    pc: 'small',
    monitor: 'small',
  });

  const minWidth = useScreenSizeValue({
    mobile: 600,
    tablet: 900,
    pc: 900,
    monitor: 900,
  });

  return (
    <HorizontalScrollTable {...tableProps} minWidth={minWidth}>
      <thead>
        <tr>
          <th>
            <span>Name</span>
          </th>
          <th>
            <span>APR</span>
          </th>
          <th>
            <span>Total Staked</span>
          </th>
          <th />
        </tr>
      </thead>

      <tbody>
        {staking.map(
          ({ index, id, name, apr, totalStaked, isActive, symbol }) => (
            <tr key={'row' + index}>
              <td>
                <CoupledIconsHolder radiusEm={1.1}>
                  <TokenIcon symbol="UST" />
                  <TokenIcon symbol={symbol} />
                </CoupledIconsHolder>
                <div className="name-container">
                  {!isActive && <DelistedBadge />}
                  {name}
                </div>
              </td>
              <td>{formatRate(apr)}%</td>
              <td>{`${formatUTokenWithPostfixUnits(totalStaked)} UST`}</td>
              <td>
                <Button
                  size={buttonSize}
                  color="paleblue"
                  componentProps={{
                    component: Link,
                    to: `/staking/${id}/stake`,
                  }}
                >
                  Stake
                </Button>
                <Button
                  size={buttonSize}
                  color="border"
                  componentProps={{
                    component: Link,
                    to: `/staking/${id}/unstake`,
                  }}
                >
                  Unstake
                </Button>
              </td>
            </tr>
          ),
        )}
      </tbody>
    </HorizontalScrollTable>
  );
}

export const StyledStakingTable = styled(StakingTableBase)`
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
    &:nth-child(1) {
      display: flex;
      align-items: center;
      gap: 0.6em;

      font-weight: 500 !important;
    }

    &:nth-child(4) {
      a {
        min-width: 6.5em;

        &:last-child {
          margin-left: 0.9em;
        }
      }
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

  .name-container {
    display: flex;
    align-items: center;
  }
`;

export const StakingTable = fixHMR(StyledStakingTable);
