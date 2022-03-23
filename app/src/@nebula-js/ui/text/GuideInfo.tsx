import { DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';
import styled from 'styled-components';
import React, { useState } from 'react';
import { DocsIcon } from '@nebula-js/icons';
import { ExpandLessRounded, ExpandMoreRounded } from '@material-ui/icons';
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
  readMore: boolean;
}

function ContentBase({ children, readMore, className }: ContentProps) {
  return (
    <div className={className}>
      {children} {!readMore && '...'}
    </div>
  );
}

const Content = styled(ContentBase)`
  span {
    color: var(--color-white52);
    font-size: var(--font-size14);
    height: 1.5em;
  }

  span.indent-text {
    margin-left: 1em;
  }

  span#extra {
    display: ${({ readMore }) => (readMore ? 'unset' : 'none')};
  }
`;

function GuideInfoBase({ children, link, ...divProps }: GuideInfoProps) {
  const [readMore, setReadMore] = useState(false);

  return (
    <div {...divProps}>
      <Content readMore={readMore}>{children}</Content>
      <div>
        <span onClick={() => setReadMore(!readMore)}>
          See {readMore ? 'Less' : 'More'}{' '}
          {readMore ? <ExpandLessRounded /> : <ExpandMoreRounded />}
        </span>
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
      color: var(--color-blue01);
    }

    > span {
      display: flex;
      align-items: center;
      font-weight: 500;
      color: var(--color-blue01);
      cursor: pointer;
    }

    > a {
      display: flex;
      align-items: center;
      text-decoration: none;
      color: var(--color-blue01);
      margin-left: 1.42857143em;
      font-weight: 500;

      > svg {
        font-size: 1em;
        margin-right: 0.35714em;
      }
    }
  }
`;

export const GuideInfo = fixHMR(StyledGuideInfo);
