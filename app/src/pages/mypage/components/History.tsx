import { SendIcon } from '@nebula-js/icons';
import { breakpoints, TableHeader, TextLink } from '@nebula-js/ui';
import React from 'react';
import { CSVLink } from 'react-csv';
import styled from 'styled-components';

export interface HistoryProps {
  className?: string;
}

const headers = [
  { label: 'Date', key: 'date' },
  { label: 'From', key: 'from' },
  { label: 'To', key: 'to' },
  { label: 'Description', key: 'description' },
];

const data = [
  { date: new Date(), from: 'aaaaa1', to: 'bbbb1', description: 'Sample Data' },
  { date: new Date(), from: 'aaaaa2', to: 'bbbb2', description: 'Sample Data' },
  { date: new Date(), from: 'aaaaa3', to: 'bbbb3', description: 'Sample Data' },
  { date: new Date(), from: 'aaaaa4', to: 'bbbb4', description: 'Sample Data' },
];

function HistoryBase({ className }: HistoryProps) {
  return (
    <div className={className}>
      <TableHeader>
        <h2>
          <s>History</s>
        </h2>
        <div className="buttons">
          <TextLink component={CSVLink} data={data} headers={headers}>
            <SendIcon
              style={{
                marginRight: '0.5em',
                transform: 'translateY(-0.1em)',
              }}
            />{' '}
            CSV
          </TextLink>
        </div>
      </TableHeader>
      <ul>
        {Array.from({ length: Math.floor(Math.random() * 10) + 4 }, (_, i) => (
          <li key={'history' + i}>
            <div>
              <p>Trade</p>
              <p>Bought 100.123456 NIAB with 100.12 UST</p>
            </div>
            <div>Apr 19, 2021, 18:01 PM</div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export const History = styled(HistoryBase)`
  background-color: var(--color-gray14);
  border-radius: 8px;

  > header {
    border-bottom: 1px solid var(--color-gray11);
  }

  > ul {
    padding: 0;
    list-style: none;

    li {
      padding: 1.8rem 2rem;

      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1em;

      font-size: 16px;

      > :first-child {
        color: var(--color-white92);

        > :first-child {
          font-size: 12px;
          color: var(--color-white44);
        }
      }

      > :last-child {
        font-size: 0.75em;
        color: var(--color-white44);
      }

      &:not(:last-child) {
        border-bottom: 1px solid var(--color-gray11);
      }
    }
  }

  @media (max-width: ${breakpoints.tablet.max}px) {
    > ul {
      li {
        padding: 1rem;

        flex-direction: column;
        align-items: flex-start;

        font-size: 14px;
      }
    }
  }
`;
