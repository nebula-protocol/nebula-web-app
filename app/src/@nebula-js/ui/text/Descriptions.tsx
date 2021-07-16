import React, { DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';
import styled from 'styled-components';

export interface Description {
  label: ReactNode;
  text: ReactNode;
}

export interface DescriptionsProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  className?: string;
  descriptions: Description[];
  direction: 'horizontal' | 'vertical';
}

function DescriptionsBase({
  descriptions,
  direction,
  ...divProps
}: DescriptionsProps) {
  return (
    <div {...divProps} data-direction={direction}>
      {descriptions.map(({ label, text }, i) => (
        <div key={'description-' + i}>
          <span>{label}</span>
          <span>{text}</span>
        </div>
      ))}
    </div>
  );
}

export const Descriptions = styled(DescriptionsBase)`
  font-size: 12px;

  display: flex;

  span:first-child {
    margin-right: 1em;
    color: var(--color-white44);
  }

  &[data-direction='horizontal'] {
    gap: 1.6em;
  }

  > * {
    word-break: keep-all;
    white-space: nowrap;
  }

  &[data-direction='vertical'] {
    flex-direction: column;
    gap: 1em;

    > * {
      display: flex;
      justify-content: space-between;

      > :first-child {
        margin-right: 2em;
      }
    }
  }
`;
