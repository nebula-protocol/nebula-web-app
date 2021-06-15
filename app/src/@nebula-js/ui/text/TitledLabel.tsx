import React, { ReactNode } from 'react';
import styled from 'styled-components';

export interface TitledLabelProps {
  className?: string;
  title: ReactNode;
  text: ReactNode;
}

function TitledLabelBase({ className, text, title }: TitledLabelProps) {
  return (
    <div className={className}>
      <h4>{title}</h4>
      <p>{text}</p>
    </div>
  );
}

export const TitledLabel = styled(TitledLabelBase)`
  > h4 {
    font-size: 12px;
    color: ${({ theme }) => theme.colors.white44};

    margin-bottom: 5px;
  }
`;
