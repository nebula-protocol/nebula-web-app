import React, { DetailedHTMLProps, TableHTMLAttributes } from 'react';
import styled from 'styled-components';
import { breakpoints } from '../env';

export interface HorizontalScrollTableProps
  extends DetailedHTMLProps<
    TableHTMLAttributes<HTMLTableElement>,
    HTMLTableElement
  > {
  className?: string;

  minWidth: number;

  startPadding?: `${number}rem`;

  endPadding?: `${number}rem`;

  fontSize?: 'normal' | 'small';
}

const _startPadding = '2rem';
const _endPadding = '2rem';

function HorizontalScrollTableBase({
  className,
  minWidth,
  startPadding = _startPadding,
  endPadding = _endPadding,
  ...tableProps
}: HorizontalScrollTableProps) {
  return (
    <div className={className}>
      <div className="scroll-container">
        <table cellPadding="0" cellSpacing="0" {...tableProps} />
      </div>
    </div>
  );
}

export const HorizontalScrollTable = styled(HorizontalScrollTableBase)`
  font-size: ${({ fontSize = 'normal' }) =>
    fontSize === 'normal' ? '1.15rem' : '0.9rem'};

  > .scroll-container {
    overflow-x: scroll;

    > table {
      table-layout: auto;
      width: 100%;
      min-width: ${({ minWidth }) => minWidth}px;

      th,
      td {
        white-space: nowrap;
      }

      thead {
        th,
        td {
          font-size: 1em;

          span {
            font-size: 12px;
          }

          color: ${({ theme }) => theme.colors.white44};
          font-weight: 500;

          padding: 1em;

          &:first-child {
            padding-left: ${({ startPadding = _startPadding }) => startPadding};
          }

          &:last-child {
            padding-right: ${({ endPadding = _endPadding }) => endPadding};
          }
        }
      }

      tbody,
      tfoot {
        th,
        td {
          font-size: 1em;

          font-weight: 300;

          color: ${({ theme }) => theme.colors.white80};
          padding: 1.5em 0.7em;

          &:first-child {
            padding-left: ${({ startPadding = _startPadding }) => startPadding};
          }

          &:last-child {
            padding-right: ${({ endPadding = _endPadding }) => endPadding};
          }
        }

        tr {
          &:last-child {
            th,
            td {
              border-bottom: 0;
            }
          }

          &:first-child {
            th,
            td {
              border-top: 0;
            }
          }
        }
      }
    }
  }

  // mobile
  @media (max-width: ${breakpoints.mobile.max}px) {
    font-size: 0.85rem;

    > .scroll-container {
      > table {
        thead {
          th {
            span {
              font-size: 1em;
            }
          }
        }
      }
    }
  }
`;
