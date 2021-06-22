import { breakpoints } from '@nebula-js/ui';
import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { Footer } from './Footer';

export interface FormLayoutProps {
  className?: string;
  containerClassName?: string;
  title: ReactNode;
  children: ReactNode;
}

function FormLayoutBase({
  className,
  containerClassName,
  title,
  children,
}: FormLayoutProps) {
  return (
    <Container className={containerClassName}>
      <div>
        <h1>{title}</h1>
        <hr />
        <section className={className}>{children}</section>
        <Footer />
      </div>
    </Container>
  );
}

const Container = styled.section`
  padding: 70px 50px 50px 50px;

  > div {
    max-width: 1080px;
    margin: 0 auto;

    > h1 {
      font-size: var(--font-size32);
      font-weight: 500;
      margin-bottom: 16px;
    }

    > hr {
      border: 0;
      border-bottom: 1px solid ${({ theme }) => theme.colors.gray18};
      margin: 0 0 48px;
    }

    > section {
      margin: 0 auto;
      max-width: 650px;
    }
  }

  // small layout
  @media (max-width: ${breakpoints.tablet.max}px) {
    padding: 24px 16px 16px 16px;

    > div {
      > h1 {
        border-bottom: 0;
        margin-bottom: 20px;
      }

      > hr {
        display: none;
      }
    }
  }
`;

export const FormLayout = styled(FormLayoutBase)``;
