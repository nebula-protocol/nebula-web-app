import { fixHMR } from 'fix-hmr';
import React, {
  CSSProperties,
  DetailedHTMLProps,
  ReactNode,
  TableHTMLAttributes,
} from 'react';
import styled from 'styled-components';
import { breakpoints } from '../env';

export interface HorizontalScrollTableProps
  extends Omit<
    DetailedHTMLProps<TableHTMLAttributes<HTMLTableElement>, HTMLTableElement>,
    'ref'
  > {
  className?: string;

  minWidth: number;

  startPadding?: `${number}rem`;

  endPadding?: `${number}rem`;

  fontSize?: `${number}rem`;

  headerContents?: ReactNode;

  footerContents?: ReactNode;

  containerStyle?: CSSProperties;
}

const _startPadding = '2rem';
const _endPadding = '2rem';

function HorizontalScrollTableBase({
  className,
  minWidth,
  startPadding = _startPadding,
  endPadding = _endPadding,
  fontSize,
  headerContents,
  footerContents,
  containerStyle,
  ...tableProps
}: HorizontalScrollTableProps) {
  return (
    <div className={className} style={containerStyle}>
      {headerContents}
      <div className="scroll-container">
        <table cellPadding="0" cellSpacing="0" {...tableProps} />
      </div>
      {footerContents}
    </div>
  );
}

const StyledHorizontalScrollTable = styled(HorizontalScrollTableBase)`
  font-size: ${({ fontSize = '1rem' }) => fontSize};

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
          //font-size: 1em;

          span {
            font-size: 12px;
          }

          color: var(--color-white4);
          font-weight: 500;

          padding: 1.42857143em 1em;

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
          //font-size: 1em;

          font-weight: 400;

          color: var(--color-white3);
          padding: 1.42857143em 1em;

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
    font-size: ${({ fontSize = '1rem' }) => fontSize};

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

export const HorizontalScrollTable = fixHMR(StyledHorizontalScrollTable);
