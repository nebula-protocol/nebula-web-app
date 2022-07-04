import { DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';
import styled from 'styled-components';
import React from 'react';
import { DocsIcon } from '@nebula-js/icons';
import { fixHMR } from 'fix-hmr';

export interface GuideInfoProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  className?: string;
  children: ReactNode;
  link: string;
}

export interface ContentProps {
  className?: string;
  children: ReactNode;
}

function ContentBase({ children, className }: ContentProps) {
  return <div className={className}>{children}</div>;
}

const Content = styled(ContentBase)`
  span {
    color: var(--color-white5);
    font-size: var(--font-size14);
    height: 1.5em;
  }

  span.indent-text {
    margin-left: 1em;
  }
`;

function GuideInfoBase({ children, link, ...divProps }: GuideInfoProps) {
  return (
    <div {...divProps}>
      <Content>{children}</Content>
      <div>
        <a href={link} target="_blank" rel="noreferrer">
          <DocsIcon /> See Guideline
        </a>
      </div>
    </div>
  );
}

const StyledGuideInfo = styled(GuideInfoBase)`
  > div:not(:first-child) {
    margin-top: 1.2em;
    display: flex;

    svg {
      color: var(--color-blue);
    }

    > span {
      display: flex;
      align-items: center;
      font-weight: 500;
      color: var(--color-blue);
      cursor: pointer;
    }

    > a {
      display: flex;
      align-items: center;
      text-decoration: none;
      color: var(--color-blue);
      font-weight: 500;

      > svg {
        font-size: 1em;
        margin-right: 0.35714em;
      }
    }
  }
`;

export const GuideInfo = fixHMR(StyledGuideInfo);
