import { SendIcon } from '@nebula-js/icons';
import {
  Button,
  Descriptions,
  EmptyButton,
  HorizontalScrollTable,
  useScreenSizeValue,
} from '@nebula-js/ui';
import React from 'react';
import styled from 'styled-components';
import { TableHeader } from './internal/TableHeader';

export interface GovernanceProps {
  className?: string;
}

function GovernanceBase({ className }: GovernanceProps) {
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
    hook: (w) => (w > 800 && w < 950 ? 'vertical' : null),
  });

  return (
    <HorizontalScrollTable
      className={className}
      minWidth={tableMinWidth}
      startPadding={startPadding}
      endPadding={startPadding}
      headerContents={
        <TableHeader>
          <h2>Governance</h2>
          <div className="buttons">
            <EmptyButton>
              <SendIcon style={{ marginRight: '0.5em' }} /> Claim Rewards
            </EmptyButton>
            <EmptyButton>
              <SendIcon style={{ marginRight: '0.5em' }} /> Restake Reward
            </EmptyButton>
          </div>
          <Descriptions
            className="descriptions"
            direction={descriptionDisplay}
            descriptions={[
              { label: 'Staked NEB', text: '2,020.06 NEB' },
              { label: 'Staking APR', text: '123.12%' },
              { label: 'Voting Reward', text: '2,020.06 UST' },
            ]}
          />
        </TableHeader>
      }
    >
      <thead>
        <tr>
          <th>
            <span>Title</span>
          </th>
          <th>
            <span>Vote</span>
          </th>
          <th>
            <span>Voted NEB</span>
          </th>
          <th>
            <span>Actions</span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Register NEB Parameters</td>
          <td>YES</td>
          <td>54.062222 NEB</td>
          <td>
            <Button size={tableButtonSize} color="border">
              Poll Detail
            </Button>
          </td>
        </tr>
      </tbody>
    </HorizontalScrollTable>
  );
}

export const Governance = styled(GovernanceBase)`
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
