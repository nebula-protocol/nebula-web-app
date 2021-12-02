import React, { ReactElement, SVGProps, useMemo } from 'react';
import styled from 'styled-components';

export interface PartitionBarGraphProps extends SVGProps<SVGSVGElement> {
  data: Array<{ value: number; color: string }>;
  width: number;
  height: number;
  gap?: number;
}

function PartitionBarGraphBase({
  data,
  width,
  height,
  gap = 1,
  ...svgProps
}: PartitionBarGraphProps) {
  const rects = useMemo(() => {
    const total = data.reduce((t, { value }) => t + value, 0);

    return data.reduce(
      ({ elements, x }, { value, color }, i) => {
        const computedWidth = (value / total) * (width - gap * data.length);
        const w = isNaN(computedWidth) ? 1 : computedWidth;

        elements.push(
          <rect
            key={'rect' + i}
            x={x}
            y={0}
            width={w}
            height={height}
            fill={color}
          />,
        );
        return { elements, x: x + w + gap };
      },
      { elements: [] as ReactElement[], x: 0 },
    ).elements;
  }, [data, gap, height, width]);

  return (
    <svg {...svgProps} width={width} height={height}>
      {rects}
    </svg>
  );
}

export const PartitionBarGraph = styled(PartitionBarGraphBase)``;
