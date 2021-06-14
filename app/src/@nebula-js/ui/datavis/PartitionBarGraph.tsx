import React, { ReactElement, SVGProps, useMemo } from 'react';
import styled from 'styled-components';

export interface PartitionBarGraphProps extends SVGProps<SVGSVGElement> {
  data: Array<{ value: number; color: string }>;
  width: number;
  height: number;
}

function PartitionBarGraphBase({
  data,
  width,
  height,
  ...svgProps
}: PartitionBarGraphProps) {
  const rects = useMemo(() => {
    const total = data.reduce((t, { value }) => t + value, 0) - data.length;

    return data.reduce(
      ({ elements, x }, { value, color }, i) => {
        const w = Math.floor((value / total) * width);

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
        return { elements, x: x + w + 1 };
      },
      { elements: [] as ReactElement[], x: 0 },
    ).elements;
  }, [data, height, width]);

  return (
    <svg {...svgProps} width={width} height={height}>
      {rects}
    </svg>
  );
}

export const PartitionBarGraph = styled(PartitionBarGraphBase)`
  // TODO
`;
