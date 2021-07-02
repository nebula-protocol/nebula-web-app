import { ExpandMore } from '@material-ui/icons';
import {
  EmptyButton,
  HorizontalScrollTable,
  TableHeader,
  useScreenSizeValue,
} from '@nebula-js/ui';
import { fixHMR } from 'fix-hmr';
import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

export interface PollsTableProps {
  className?: string;
}

function PollsTableBase({ className }: PollsTableProps) {
  const history = useHistory();

  const tableMinWidth = useScreenSizeValue({
    mobile: 600,
    tablet: 900,
    pc: 900,
    monitor: 900,
  });

  const startPadding = useScreenSizeValue<`${number}rem`>({
    mobile: '1rem',
    tablet: '1rem',
    pc: '2rem',
    monitor: '2rem',
  });

  const gotoPoll = useCallback(
    (pollId: string) => {
      history.push(`/poll/${pollId}`);
    },
    [history],
  );

  return (
    <HorizontalScrollTable
      className={className}
      minWidth={tableMinWidth}
      startPadding={startPadding}
      endPadding={startPadding}
      headerContents={
        <TableHeader>
          <h2>Polls</h2>
          <div className="buttons">
            <EmptyButton>
              All
              <ExpandMore style={{ marginLeft: '0.5em' }} />
            </EmptyButton>
          </div>
        </TableHeader>
      }
    >
      <thead>
        <tr>
          <th>
            <span>Poll Type</span>
          </th>
          <th>
            <span>Title</span>
          </th>
          <th>
            <span>Vote Status</span>
          </th>
          <th>
            <span>Status</span>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr onClick={() => gotoPoll('poll01')}>
          <td>Whitelist CV</td>
          <td>Whitelist $NDOG</td>
          <td>
            <p>Quorum 7.24% / 10%</p>
            <p>YES 5.12% NO 2.12%</p>
          </td>
          <td>In Progress</td>
        </tr>
        <tr onClick={() => gotoPoll('poll02')}>
          <td>Whitelist CV</td>
          <td>Whitelist $NDOG</td>
          <td>
            <p>Quorum 7.24% / 10%</p>
            <p>YES 5.12% NO 2.12%</p>
          </td>
          <td>In Progress</td>
        </tr>
      </tbody>
    </HorizontalScrollTable>
  );
}

const StyledPollsTable = styled(PollsTableBase)`
  background-color: var(--color-gray14);
  border-radius: 8px;

  td,
  th {
    text-align: left;

    &:last-child {
      text-align: right;
    }
  }

  td {
    &:nth-child(2) {
      font-weight: 500 !important;
      color: var(--color-white92);
    }

    &:nth-child(3) {
      p {
        font-size: 12px;
        line-height: 18px;
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
    tr {
      cursor: pointer;

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

export const PollsTable = fixHMR(StyledPollsTable);
