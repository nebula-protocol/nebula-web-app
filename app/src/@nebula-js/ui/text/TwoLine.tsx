import React, { ReactNode } from 'react';
import styled from 'styled-components';

export interface TwoLineProps {
  className?: string;
  text: ReactNode;
  subText?: ReactNode;
}

export function TwoLineBase({ className, text, subText }: TwoLineProps) {
  return (
    <div className={className}>
      <p>{text}</p>
      <p>{subText}</p>
    </div>
  );
}

export const TwoLine = styled(TwoLineBase)`
  > :nth-child(2) {
    font-size: 12px;
    color: var(--color-white44);
  }
`;
