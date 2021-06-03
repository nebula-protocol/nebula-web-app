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
  }
`;
