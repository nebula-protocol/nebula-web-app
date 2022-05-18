import React, { useRef, SVGProps, useMemo, useEffect, useState } from 'react';
import styled from 'styled-components';
import { formatFluidDecimalPoints } from '@libs/formatter';
import { fixHMR } from 'fix-hmr';

export interface BarGraphProps extends SVGProps<SVGSVGElement> {
  portfolioRatio: number;
  targetRatio: number;
}

function BarGraphBase({
  portfolioRatio,
  targetRatio,
  ...svgProps
}: BarGraphProps) {
  const textRef = useRef<SVGTextElement>(null);
  const [textX, setTextX] = useState(0);
  const width = 300;
  const height = 40;

  const lineX = useMemo(() => {
    return Math.min(targetRatio * width, width - 1);
  }, [targetRatio, width]);

  useEffect(() => {
    const textWidth = textRef.current?.getBBox().width ?? 0;

    if (lineX > textWidth && width - lineX > textWidth) {
      setTextX(lineX - textWidth / 2);
    } else if (lineX < textWidth) {
      setTextX(lineX);
    } else {
      setTextX(lineX - textWidth);
    }
  }, [targetRatio, lineX]);

  return (
    <svg {...svgProps} width={width} height={height}>
      <text x={textX} y={18} ref={textRef}>
        Target:{' '}
        <tspan fontWeight={700}>
          {formatFluidDecimalPoints(targetRatio * 100, 2)}%
        </tspan>
      </text>
      <rect x={0} y={28} width={width} height={16} id="bar-graph-bg" />
      <rect
        x={0}
        y={28}
        width={width * portfolioRatio}
        height={16}
        id="bar-graph-bar"
      />
      <rect x={lineX} y={22} width={1} height={18} id="bar-graph-line" />
    </svg>
  );
}

export const StyledBarGraph = styled(BarGraphBase)`
  > text {
    font-size: 12px;
    fill: var(--color-white80);
    line-height: 18px;
  }

  rect#bar-graph-line {
    fill: var(--color-white80);
  }

  rect#bar-graph-bg {
    fill: var(--color-gray34);
  }

  rect#bar-graph-bar {
    fill: var(--color-blue01);
  }
`;

export const BarGraph = fixHMR(StyledBarGraph);
