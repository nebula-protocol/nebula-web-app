import React, { DetailedHTMLProps, HTMLAttributes } from 'react';
import styled, { css } from 'styled-components';
import { breakpoints } from '../env';

export interface SectionProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
  isLoading?: boolean;
}

function SectionBase({ isLoading, children, ...sectionProps }: SectionProps) {
  return (
    <section {...sectionProps}>
      {children}
      {isLoading && <div>Loading...</div>}
    </section>
  );
}

const loadingStyle = css`
  pointer-events: none;
`;

export const sectionStyle = css`
  --section-padding-h: 2.3rem;
  --section-padding-v: 2.85rem;

  padding: var(--section-padding-v) var(--section-padding-h);

  border-radius: 8px;

  background-color: var(--color-gray3);
  color: var(--color-white2);

  transition: background-color 0.3s ease-in-out;

  h1 {
    font-size: 2rem;
  }

  // small layout
  @media (max-width: ${breakpoints.tablet.max}px) {
    --section-padding-h: 1.7rem;
    --section-padding-v: 2.3rem;

    h1 {
      font-size: 1.6rem;
    }
  }
`;

export const Section = styled(SectionBase)`
  ${({ isLoading = false }) => (isLoading ? loadingStyle : '')};

  ${sectionStyle};
`;
