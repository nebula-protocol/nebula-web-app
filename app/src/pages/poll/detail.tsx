import { formatToken } from '@nebula-js/notation';
import { Token } from '@nebula-js/types';
import {
  breakpoints,
  Button,
  HorizontalScrollTable,
  PartitionBarGraph,
  Section,
  TwoLine,
  useScreenSizeValue,
} from '@nebula-js/ui';
import { MainLayout } from 'components/layouts/MainLayout';
import React, { useState } from 'react';
import styled from 'styled-components';
import useResizeObserver from 'use-resize-observer/polyfilled';
import { VoteForm } from './components/VoteForm';

export interface PollDetailProps {
  className?: string;
}

function PollDetailBase({ className }: PollDetailProps) {
  const [startVote, setStartVote] = useState<boolean>(false);

  const { ref, width = 300 } = useResizeObserver();

  const buttonSize = useScreenSizeValue<'normal' | 'medium'>({
    mobile: 'medium',
    tablet: 'normal',
    pc: 'normal',
    monitor: 'normal',
  });

  return (
    <MainLayout className={className}>
      <h1>Poll details</h1>

      <div className="layout">
        <div className="description-column">
          <Section className="summary">
            <header>
              <div>Whitelist CV</div>
              <div>In Progress</div>
            </header>

            <h2>Whitelist $NDOG</h2>

            <p>
              <span>Creater</span>terra...dkjekjf
            </p>
            <p>
              <span>Estimated end time</span>Mon, May 30, 12:34 PM
            </p>
            {startVote ? (
              <VoteForm className="form" />
            ) : (
              <Button
                size={buttonSize}
                color="paleblue"
                fullWidth
                onClick={() => setStartVote(true)}
              >
                Vote
              </Button>
            )}
          </Section>

          <Section className="detail">
            <div>
              <h4>Description</h4>
              <p>
                The following is a proposal to whitelist the parameters of SPY,
                which has been passed. Please see the ref whitelist poll and
                attached link. Also note that the collateral ratio has been set
                as 130%.
              </p>
            </div>

            <div>
              <h4>Affected Cluster</h4>
              <p>Next DOGE (NDOG)</p>
            </div>

            <div>
              <h4>Oracle Feeder</h4>
              <p>terra128968w0r6cche4pmf4xn5358kx2gth6tr</p>
            </div>

            <div>
              <h4>Asset Allocation</h4>
              <ul>
                <li>
                  <i /> Mirror Protocol (MIR) : 40%
                </li>
                <li>
                  <i /> Anchor Protocol (ANC) : 40%
                </li>
                <li>
                  <i /> Luna (LUNA) : 40%
                </li>
              </ul>
            </div>

            <div>
              <h4>Penalty Parameters</h4>
              <p>Alpha Plus : 1</p>
              <p>Alpha Minus : -1</p>
              <p>Sigma Plus : 1</p>
              <p>Sigma Minus : -1</p>
            </div>
          </Section>
        </div>

        <Section className="voters">
          <header>
            <TwoLine text="Yes 30%" subText="195.494 NEB" />
            <TwoLine text="No 30%" subText="195.494 NEB" />
            <TwoLine text="Abstain 30%" subText="195.494 NEB" />
          </header>

          <div ref={ref} className="voters-table">
            <PartitionBarGraph
              data={[
                { value: 3, color: '#23bed9' },
                { value: 1, color: '#f15e7e' },
                {
                  value: 1,
                  color: '#a4a4a4',
                },
                { value: 7, color: '#3d3d3d' },
              ]}
              width={width}
              height={16}
              gap={0}
            />
          </div>

          <Table
            minWidth={300}
            fontSize="0.9rem"
            startPadding="0rem"
            endPadding="0rem"
          >
            <thead>
              <tr>
                <th>
                  <span>Voter</span>
                </th>
                <th>
                  <span>Vote</span>
                </th>
                <th>
                  <span>Balance</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 20 }, (_, i) => (
                <tr key={'row' + i}>
                  <td>terra1…4w8zd7</td>
                  <td>{Math.random() > 0.5 ? 'YES' : 'NO'}</td>
                  <td>
                    {formatToken((Math.random() * 100000) as Token<number>)} NEB
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Section>
      </div>
    </MainLayout>
  );
}

const Table = styled(HorizontalScrollTable)`
  td,
  th {
    text-align: left;

    &:last-child {
      text-align: right;
    }
  }

  thead {
    tr {
      th {
        border-bottom: 1px solid ${({ theme }) => theme.colors.gray24};
      }
    }
  }
`;

const StyledPollDetail = styled(PollDetailBase)`
  h1 {
    margin-bottom: 24px;
  }

  .layout {
    display: flex;

    gap: 32px;

    .description-column {
      flex: 1;

      .summary {
        margin-bottom: 12px;

        > header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;

          font-size: 14px;
          height: 45px;

          border-bottom: 1px solid ${({ theme }) => theme.colors.gray24};

          margin-bottom: 16px;
        }

        > h2 {
          font-size: 24px;
          color: ${({ theme }) => theme.colors.white100};

          margin-bottom: 30px;
        }

        > p {
          font-size: 14px;

          span {
            color: ${({ theme }) => theme.colors.white44};
            margin-right: 8px;
          }

          margin-bottom: 14px;
        }

        > button {
          display: block;
          margin: 40px auto 0 auto;
          max-width: 360px;
        }

        > .form {
          margin-top: 40px;
        }
      }
    }

    .detail {
      > div {
        font-size: 14px;

        h4 {
          color: ${({ theme }) => theme.colors.white44};
          font-weight: 500;

          margin-bottom: 4px;
        }

        p {
          line-height: 21px;
          color: ${({ theme }) => theme.colors.white100};
        }

        &:not(:last-child) {
          margin-bottom: 28px;
        }
      }
    }

    .voters {
      min-width: 420px;
      max-width: 420px;

      background-color: ${({ theme }) => theme.colors.gray14};

      header {
        display: flex;
        gap: 18px;

        margin-bottom: 3rem;
      }

      .voters-table {
        margin-bottom: 2rem;
      }
    }
  }

  @media (max-width: 1100px) {
    .layout {
      flex-direction: column;

      gap: 12px;

      .voters {
        min-width: unset;
        max-width: unset;
      }
    }
  }

  @media (max-width: ${breakpoints.tablet.max}px) {
    h1 {
      margin-bottom: 20px;
    }

    .layout {
      .description-column {
        .summary {
          > p {
            span {
              display: block;
            }
          }
        }
      }
    }
  }
`;

export default process.env.NODE_ENV === 'production'
  ? StyledPollDetail
  : (props: PollDetailProps) => <StyledPollDetail {...props} />;
