import { SendIcon } from '@nebula-js/icons';
import {
  Button,
  Descriptions,
  EmptyButton,
  HorizontalScrollTable,
  Table3SectionHeader,
  TwoLine,
  useScreenSizeValue,
} from '@nebula-js/ui';
import React from 'react';
import styled from 'styled-components';

export interface StakingProps {
  className?: string;
}

function StakingBase({ className }: StakingProps) {
  const tableMinWidth = useScreenSizeValue({
    mobile: 700,
    tablet: 900,
    pc: 900,
    monitor: 900,
  });

  const tableButtonSize = useScreenSizeValue<'small' | 'tiny'>({
    mobile: 'tiny',
    tablet: 'small',
    pc: 'small',
    monitor: 'small',
  });

  const startPadding = useScreenSizeValue<`${number}rem`>({
    mobile: '1rem',
    tablet: '1rem',
    pc: '2rem',
    monitor: '2rem',
  });

  const descriptionDisplay = useScreenSizeValue<'horizontal' | 'vertical'>({
    mobile: 'vertical',
    tablet: 'vertical',
    pc: 'horizontal',
    monitor: 'horizontal',
    hook: (w) => (w > 800 && w < 950 ? 'vertical' : null),
  });

  return (
    <HorizontalScrollTable
      className={className}
      minWidth={tableMinWidth}
      startPadding={startPadding}
      endPadding={startPadding}
      headerContents={
        <Table3SectionHeader>
          <h2>Staking</h2>
          <div className="buttons">
            <EmptyButton>
              <SendIcon style={{ marginRight: '0.5em' }} /> Claim All Rewards
            </EmptyButton>
          </div>
          <Descriptions
            className="descriptions"
            direction={descriptionDisplay}
            descriptions={[
              { label: 'Total Farm Value', text: '2,020.06 UST' },
              { label: 'Total Reward', text: '2,020.06 NEB' },
              { label: 'Total Reward Value', text: '2,020.06 UST' },
            ]}
          />
        </Table3SectionHeader>
      }
    >
      <thead>
        <tr>
          <th>
            <span>
              Name
              <br />
              APR
            </span>
          </th>
          <th>
            <span>Staked</span>
          </th>
          <th>
            <span>
              Withdrawable Asset
              <br />
              Value
            </span>
          </th>
          <th>
            <span>
              Reward Amount
              <br />
              Value
            </span>
          </th>
          <th>
            <span>Actions</span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <TwoLine text="NEB-UST LP" subText="123.12%" />
          </td>
          <td>254.062 UST</td>
          <td>
            <TwoLine
              text="100.34625 NEB + 100.11 UST"
              subText="10,000.11 UST"
            />
          </td>
          <td>
            <TwoLine text="100.34625 NEB" subText="10,000.11 UST" />
          </td>
          <td>
            <Button size={tableButtonSize} color="border">
              Unstake
            </Button>
          </td>
        </tr>
      </tbody>
    </HorizontalScrollTable>
  );
}

export const Staking = styled(StakingBase)`
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
      font-size: 1.2em;
      font-weight: 500 !important;
      color: var(--color-white92);
    }

    &:nth-child(4) {
      button {
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
`;
