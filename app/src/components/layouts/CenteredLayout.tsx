import { breakpoints } from '@nebula-js/ui';
import React, { ReactNode } from 'react';
import styled from 'styled-components';

export interface CenteredLayoutProps {
  className?: string;
  containerClassName?: string;
  children: ReactNode;
}

function CenteredLayoutBase({
  className,
  containerClassName,
  children,
}: CenteredLayoutProps) {
  return (
    <Container className={containerClassName}>
      <div className={className}>{children}</div>
    </Container>
  );
}

const Container = styled.section`
  padding: 32px 64px 0px 64px;

  > div {
    max-width: 1156px;
    margin: 0 auto;
  }

  // small layout
  @media (max-width: ${breakpoints.tablet.max}px) {
    padding: 0px 16px;
  }
`;

export const CenteredLayout = styled(CenteredLayoutBase)``;
