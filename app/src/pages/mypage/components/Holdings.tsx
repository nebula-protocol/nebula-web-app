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

export interface HoldingsProps {
  className?: string;
}

function HoldingsBase({ className }: HoldingsProps) {
  const tableMinWidth = useScreenSizeValue({
    mobile: 600,
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
  });

  return (
    <HorizontalScrollTable
      className={className}
      minWidth={tableMinWidth}
      startPadding={startPadding}
      endPadding={startPadding}
      headerContents={
        <Table3SectionHeader>
          <h2>Holdings</h2>
          <div className="buttons">
            <EmptyButton>
              <SendIcon style={{ marginRight: '0.5em' }} /> Send
            </EmptyButton>
          </div>
          <Descriptions
            className="descriptions"
            direction={descriptionDisplay}
            descriptions={[
              { label: 'Total Holdings Value', text: '2,020.06 UST' },
            ]}
          />
        </Table3SectionHeader>
      }
    >
      <thead>
        <tr>
          <th>
            <span>Ticker</span>
          </th>
          <th>
            <span>Price</span>
          </th>
          <th>
            <span>Balance</span>
          </th>
          <th>
            <span>Value</span>
          </th>
          <th>
            <span>Actions</span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <TwoLine text="NEB" subText="Nebula" />
          </td>
          <td>254.062 UST</td>
          <td>100.34625</td>
          <td>254,110.172 UST</td>
          <td>
            <Button size={tableButtonSize} color="border">
              Trade
            </Button>
          </td>
        </tr>
        <tr>
          <td>
            <TwoLine text="NDOG" subText="Next DOGE" />
          </td>
          <td>254.062 UST</td>
          <td>100.34625</td>
          <td>254,110.172 UST</td>
          <td>
            <Button size={tableButtonSize} color="border">
              Trade
            </Button>
          </td>
        </tr>
      </tbody>
    </HorizontalScrollTable>
  );
}

export const Holdings = styled(HoldingsBase)`
  background-color: ${({ theme }) => theme.colors.gray14};
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
      color: ${({ theme }) => theme.colors.white92};
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
        border-bottom: 2px solid ${({ theme }) => theme.colors.gray11};
      }
    }
  }

  tbody {
    tr:not(:last-child) {
      td {
        border-bottom: 1px solid ${({ theme }) => theme.colors.gray11};
      }
    }
  }
`;
