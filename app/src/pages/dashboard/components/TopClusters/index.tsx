import { ChevronRight } from '@material-ui/icons';
import { formatRate } from '@nebula-js/notation';
import { Rate } from '@nebula-js/types';
import {
  Carousel,
  DiffSpan,
  MiniTab,
  PartitionBarGraph,
  PartitionLabel,
  PartitionLabels,
  Sub,
} from '@nebula-js/ui';
import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import useResizeObserver from 'use-resize-observer/polyfilled';

const tabItems = [
  { id: '1', label: '1' },
  { id: '2', label: '2' },
  { id: '3', label: '3' },
];

const colors = [
  '#23bed9',
  '#64a0bc',
  '#918ba8',
  '#ab7f9d',
  '#c37493',
  '#dc6887',
  '#f15e7e',
];

const data = Array.from(
  { length: Math.floor(Math.random() * 4) + 4 },
  (_, i) => ({
    label: `ITEM${i}`,
    value: Math.floor(Math.random() * 1000) + 300,
    color: colors[i % colors.length],
  }),
);

export interface TopClustersProps {
  className?: string;
}

function TopClustersBase({ className }: TopClustersProps) {
  const [slide, setSlide] = useState<number>(0);

  const { width = 300, ref } = useResizeObserver();

  const partitionLabels = useMemo<PartitionLabel[]>(() => {
    const total = data.reduce((t, { value }) => t + value, 0) - data.length;

    return data.slice(0, 3).map(({ label, value, color }) => ({
      label,
      value: formatRate((value / total) as Rate<number>) + '%',
      color,
    }));
  }, []);

  return (
    <div className={className} ref={ref}>
      <Carousel slide={slide}>
        {tabItems.map((_, i) => (
          <Content key={'cluster' + i}>
            <section className="summary">
              <i />
              <div>
                <h4>
                  Next DOGE <ChevronRight />
                </h4>
                <p>100.100232 UST</p>
                <p>
                  <DiffSpan diff={10} translateIconY="0.15em">
                    10.00%
                  </DiffSpan>
                </p>
              </div>
            </section>

            <section className="provided-asset">
              <h4>PROVIDED ASSET</h4>
              <p>1,000 UST</p>
            </section>

            <section className="supply">
              <h4>SUPPLY</h4>
              <p>100,000.123 NIAB</p>
            </section>

            <section className="graph">
              <PartitionLabels data={partitionLabels}>
                <li>
                  <span>+12</span>
                  <Sub>more</Sub>
                </li>
              </PartitionLabels>
              <PartitionBarGraph data={data} width={width} height={8} />
            </section>
          </Content>
        ))}
      </Carousel>

      <MiniTab
        className="tab"
        items={tabItems}
        selectedItem={tabItems[slide]}
        onChange={(nextTab) =>
          setSlide(
            tabItems.findIndex((tabItem) => tabItem.id === nextTab.id) ?? 0,
          )
        }
      />
    </div>
  );
}

const Content = styled.div`
  > .summary {
    display: flex;
    align-items: center;

    i {
      width: 4em;
      height: 4em;
      background-color: ${({ theme }) => theme.colors.gray34};
      border-radius: 50%;
      margin-right: 1em;
    }

    h4 {
      font-size: var(--font-size20);

      svg {
        font-size: 0.8em;
      }
    }

    p:nth-child(2) {
      color: ${({ theme }) => theme.colors.white44};
    }

    p:nth-child(3) {
      font-size: var(--font-size12);
    }

    margin-bottom: 4em;
  }

  > .provided-asset,
  > .supply {
    font-size: var(--font-size14-12);

    h4 {
      font-size: var(--font-size12);
      font-weight: 500;
      color: ${({ theme }) => theme.colors.white44};
    }

    margin-bottom: 1.5em;
  }

  > .graph {
    margin-top: 3em;

    > :first-child {
      margin-bottom: 0.5em;
    }
  }
`;

export const TopClusters = styled(TopClustersBase)`
  position: relative;

  .tab {
    position: absolute;
    top: -55px;
    right: 0;

    > li {
      width: 32px;
    }
  }
`;
