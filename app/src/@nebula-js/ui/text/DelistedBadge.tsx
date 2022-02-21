import React, { DetailedHTMLProps, HTMLAttributes } from 'react';
import styled from 'styled-components';

export interface DelistedBadgeProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  className?: string;
}

function DelistedBadgeBase({ ...divProps }: DelistedBadgeProps) {
  return <span {...divProps}>DELISTED</span>;
}

export const DelistedBadge = styled(DelistedBadgeBase)`
  font-size: 10px;
  background-color: var(--color-red01);
  border-radius: 3px;
  margin-right: 8px;
  padding: 2px 5px;
`;
