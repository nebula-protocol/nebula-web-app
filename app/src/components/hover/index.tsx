import React from 'react';
import styled from 'styled-components';
import { RebalancingReward } from './rebalancing-reward/RebalancingReward';
import { breakpoints } from '@nebula-js/ui';
import { useMediaQuery } from 'react-responsive';

export interface HoverPanelProps {
  className?: string;
}

export function HoverPanel({ className }: HoverPanelProps) {
  const isMobile = useMediaQuery({ maxWidth: breakpoints.tablet.max });

  return (
    <Container
      className={className}
      data-layout={isMobile ? 'mobile' : 'modal'}
    >
      <RebalancingReward isMobile={isMobile} />
    </Container>
  );
}

export const Container = styled.div`
  position: absolute;
  display: block;
  top: 20px;
  right: 20px;
  z-index: 0;

  > :not(:last-child) {
    margin-bottom: 15px;
  }

  &[data-layout='mobile'] {
    position: relative;
    top: 0;
    right: 0;
  }
`;
