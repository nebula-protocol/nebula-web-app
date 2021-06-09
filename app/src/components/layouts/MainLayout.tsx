import { screen } from '@nebula-js/ui';
import React, { ReactNode } from 'react';
import styled from 'styled-components';

export interface MainLayoutProps {
  className?: string;
  children: ReactNode;
}

function MainLayoutBase({ className, children }: MainLayoutProps) {
  return (
    <section className={className}>
      <div>{children}</div>
    </section>
  );
}

export const MainLayout = styled(MainLayoutBase)`
  padding: 70px 50px 50px 50px;

  > div {
    max-width: 1080px;
    margin: 0 auto;

    h1 {
      font-size: 32px;
      font-weight: 500;
    }
  }

  // mobile
  @media (max-width: ${screen.tablet.max}px) {
    padding: 24px 16px 16px 16px;

    > div {
      h1 {
        font-size: 24px;
      }
    }
  }
`;
