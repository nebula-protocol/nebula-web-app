import React, { SVGProps } from 'react';
import styled from 'styled-components';

export interface BarGraphProps extends SVGProps<SVGSVGElement> {
  ratio: number;
  trackColor?: string;
  railColor?: string;
  width: number;
  height: number;
}

function BarGraphBase({
  ratio,
  trackColor,
  railColor,
  width,
  height,
  ...svgProps
}: BarGraphProps) {
  return (
    <svg {...svgProps} width={width} height={height}>
      <rect
        x={0}
        y={0}
        width={width * ratio}
        height={height}
        fill={railColor}
      />
    </svg>
  );
}

export const BarGraph = styled(BarGraphBase)`
  background-color: ${({ trackColor, theme }) =>
    trackColor ?? theme.colors.gray34};

  rect {
    fill: ${({ railColor, theme }) => railColor ?? theme.colors.white80};
  }
`;
