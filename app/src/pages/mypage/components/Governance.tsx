import { SendIcon } from '@nebula-js/icons';
import { formatUTokenWithPostfixUnits } from '@nebula-js/notation';
import {
  Button,
  Descriptions,
  EmptyButton,
  HorizontalScrollTable,
  Table3SectionHeader,
  useScreenSizeValue,
} from '@nebula-js/ui';
import {
  useGovMyPollsQuery,
  useGovStakerQuery,
} from '@nebula-js/webapp-provider';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

export interface GovernanceProps {
  className?: string;
}

function GovernanceBase({ className }: GovernanceProps) {
  const connectedWallet = useConnectedWallet();

  const { data: myPolls = [] } = useGovMyPollsQuery();

  const { data: { govStaker } = {} } = useGovStakerQuery(
    connectedWallet?.walletAddress,
  );

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
        <Table3SectionHeader>
          <h2>Governance</h2>
          <div className="buttons">
            <EmptyButton>
              <s>
                <SendIcon style={{ marginRight: '0.5em' }} /> Claim Rewards
              </s>
            </EmptyButton>
            <EmptyButton>
              <s>
                <SendIcon style={{ marginRight: '0.5em' }} /> Restake Reward
              </s>
            </EmptyButton>
          </div>
          <Descriptions
            className="descriptions"
            direction={descriptionDisplay}
            descriptions={[
              {
                label: 'Staked NEB',
                text: `${
                  govStaker
                    ? formatUTokenWithPostfixUnits(govStaker.balance)
                    : '-'
                } NEB`,
              },
              { label: 'Staking APR', text: <s>123.12%</s> },
              { label: 'Voting Reward', text: <s>2,020.06 UST</s> },
            ]}
          />
        </Table3SectionHeader>
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
        {myPolls.map(({ poll, voterInfo }) => (
          <tr key={'poll' + poll.poll.id}>
            <td data-in-progress-over={poll.inProgressOver}>
              {poll.poll.title}
            </td>
            <td>{voterInfo ? voterInfo.vote.toUpperCase() : '-'}</td>
            <td>
              {voterInfo
                ? `${formatUTokenWithPostfixUnits(voterInfo.balance)} NEB`
                : '-'}
            </td>
            <td>
              <Button
                size={tableButtonSize}
                color="border"
                componentProps={{
                  component: Link,
                  to: `/poll/${poll.poll.id}`,
                }}
              >
                Poll Detail
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </HorizontalScrollTable>
  );
}

export const Governance = styled(GovernanceBase)`
  background-color: var(--color-gray14);
  border-radius: 8px;

  [data-in-progress-over='true'] {
    text-decoration: line-through;
  }

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
