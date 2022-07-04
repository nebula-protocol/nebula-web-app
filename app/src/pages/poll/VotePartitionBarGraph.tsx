import { ParsedPoll } from '@nebula-js/app-fns';
import { PartitionBarGraph } from '@nebula-js/ui';
import useResizeObserver from 'use-resize-observer/polyfilled';
import React from 'react';
import { fixHMR } from 'fix-hmr';
import styled from 'styled-components';
import { CircleExclamationIcon } from '@nebula-js/icons';
import big from 'big.js';
import { Rate } from '@nebula-js/types';
import { formatRate } from '@libs/formatter';

interface VotePartitionBarGraphProps {
  parsedPoll: ParsedPoll | undefined;
}

function VotePartitionBarGraphBase({ parsedPoll }: VotePartitionBarGraphProps) {
  const { ref, width = 300 } = useResizeObserver();

  const quorumCurrent = parsedPoll?.quorum.current ?? ('0' as Rate);
  const quorumGov = parsedPoll?.quorum.gov ?? ('0' as Rate);
  const quorumRatioInWidth = big(quorumGov).mul(width).toNumber();

  return (
    <div ref={ref} className="voters-table">
      <div
        style={{
          color: big(quorumCurrent).lt(quorumGov)
            ? 'var(--color-red)'
            : 'var(--color-white2)',
          display: 'flex',
          alignItems: 'center',
          marginBottom: '0.4em',
          fontSize: 'var(--font-size12)',
        }}
      >
        {big(quorumCurrent).lt(quorumGov) && (
          <CircleExclamationIcon
            id="circle-exclamation"
            style={{
              transform: 'scaleX(0.9) scaleY(0.9)',
              marginRight: '1px',
            }}
          />
        )}
        Quorum {formatRate(quorumCurrent)}% / {formatRate(quorumGov)}%
      </div>
      <div
        style={{
          width: `${quorumRatioInWidth}px`,
          borderRight: '1px solid var(--color-white5)',
          height: '8px',
        }}
      />
      <PartitionBarGraph
        data={[
          {
            value: +(parsedPoll?.votes.yesRatio ?? 0),
            color: 'var(--color-blue)',
          },
          {
            value: +(parsedPoll?.votes.noRatio ?? 0),
            color: 'var(--color-red)',
          },
          {
            value: +(parsedPoll?.votes.abstainRatio ?? 0),
            color: '#a4a4a4',
          },
          {
            value:
              1 -
              +(parsedPoll?.votes.yesRatio ?? 0) -
              +(parsedPoll?.votes.noRatio ?? 0) -
              +(parsedPoll?.votes.abstainRatio ?? 0),
            color: '#3d3d3d',
          },
        ]}
        width={width}
        height={16}
        gap={0}
      />
    </div>
  );
}

const StyledVotePartitionBarGraph = styled(VotePartitionBarGraphBase)`
  .voters-table {
    margin-bottom: 2rem;
  }
`;

export default fixHMR(StyledVotePartitionBarGraph);
