import { gov } from '@nebula-js/types';
import {
  Button,
  HorizontalScrollTable,
  Section,
  TableHeader,
  useScreenSizeValue,
} from '@nebula-js/ui';
import { EmptySelect } from '@nebula-js/ui/form/EmptySelect';
import { GovPolls } from '@nebula-js/webapp-fns';
import { useGovPollsQuery } from '@nebula-js/webapp-provider';
import { fixHMR } from 'fix-hmr';
import React, { useCallback, useMemo, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import styled from 'styled-components';

export interface PollsTableProps {
  className?: string;
}

function PollsTableBase({ className }: PollsTableProps) {
  const history = useHistory();

  const [filter, setFilter] = useState<gov.PollStatus | undefined>(undefined);

  const {
    data: { pages } = {},
    hasNextPage,
    fetchNextPage,
  } = useGovPollsQuery(filter, 6);

  const polls = useMemo<gov.PollResponse[]>(() => {
    if (!pages || pages.length === 0) {
      return [];
    }

    return [].concat(
      ...(pages
        .filter((page): page is GovPolls => !!page)
        .map((page) => page.polls.polls) as any),
    );
  }, [pages]);

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
    (pollId: number) => {
      history.push(`/poll/${pollId}`);
    },
    [history],
  );

  if (filter === undefined && pages && polls.length === 0) {
    return (
      <Section>
        No polls
        <Button componentProps={{ component: Link, to: '/polls' }}>
          Create Poll
        </Button>
      </Section>
    );
  }

  return (
    <>
      <HorizontalScrollTable
        className={className}
        minWidth={tableMinWidth}
        startPadding={startPadding}
        endPadding={startPadding}
        headerContents={
          <TableHeader>
            <h2>Polls</h2>
            <div className="buttons">
              <EmptySelect
                value={filter}
                onChange={({ currentTarget }) =>
                  setFilter(
                    currentTarget.value === 'all'
                      ? undefined
                      : (currentTarget.value as gov.PollStatus),
                  )
                }
              >
                <option label="All" value="all" />
                <option label="In Progress" value={gov.PollStatus.InProgress} />
                <option label="Passed" value={gov.PollStatus.Passed} />
                <option label="Executed" value={gov.PollStatus.Executed} />
                <option label="Rejected" value={gov.PollStatus.Rejected} />
                <option label="Expired" value={gov.PollStatus.Expired} />
              </EmptySelect>
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
          {polls.map(({ id, title, status }) => (
            <tr key={id} onClick={() => gotoPoll(id)}>
              <td>
                <s>Whitelist CV</s>
              </td>
              <td
                style={{
                  wordBreak: 'break-all',
                  whiteSpace: 'break-spaces',
                  maxWidth: 400,
                }}
              >
                {title}
              </td>
              <td>
                <p>
                  <s>Quorum 7.24% / 10%</s>
                </p>
                <p>
                  <s>YES 5.12% NO 2.12%</s>
                </p>
              </td>
              <td>{status}</td>
            </tr>
          ))}
        </tbody>
      </HorizontalScrollTable>

      {hasNextPage && (
        <Button onClick={() => fetchNextPage()}>Load More</Button>
      )}
    </>
  );
}

const StyledPollsTable = styled(PollsTableBase)`
  background-color: var(--color-gray14);
  border-radius: 8px;

  select {
    color: var(--color-paleblue);
  }

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
