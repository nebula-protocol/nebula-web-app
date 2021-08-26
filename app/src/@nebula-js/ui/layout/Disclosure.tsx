import { ExpandLessRounded, ExpandMoreRounded } from '@material-ui/icons';
import { fixHMR } from 'fix-hmr';
import React, { DetailedHTMLProps, HTMLAttributes } from 'react';
import styled from 'styled-components';

export interface DisclosureProps
  extends Omit<
    DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
    'onChange'
  > {
  title: string;
  open: boolean;
  onChange: (nextOpen: boolean) => void;
}

function DisclosureBase({
  title,
  children,
  open,
  onChange,
  ...divProps
}: DisclosureProps) {
  return (
    <div {...divProps}>
      <h4 onClick={() => onChange(!open)}>
        {title} {open ? <ExpandLessRounded /> : <ExpandMoreRounded />}
      </h4>
      {open && <div className="disclosure-content">{children}</div>}
    </div>
  );
}

export const StyledDisclosure = styled(DisclosureBase)`
  h4 {
    user-select: none;
    cursor: pointer;

    display: flex;
    align-items: center;

    svg {
      margin-left: 0.5em;
      font-size: 1em;
      transform: scale(1.2);
    }
  }

  .disclosure-content {
    padding-top: 1.5em;
  }
`;

export const Disclosure = fixHMR(StyledDisclosure);
