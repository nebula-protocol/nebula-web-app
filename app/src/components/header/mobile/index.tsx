import styled from 'styled-components';
import React from 'react';

export interface MobileHeaderProps {
  className?: string;
}

function MobileHeaderBase({ className }: MobileHeaderProps) {
  return <div className={className}>...</div>;
}

export const MobileHeader = styled(MobileHeaderBase)`
  // TODO
`;
