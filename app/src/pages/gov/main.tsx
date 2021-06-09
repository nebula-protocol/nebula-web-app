import styled from 'styled-components';
import React from 'react';

export interface GovMainProps {
  className?: string;
}

function GovMainBase({ className }: GovMainProps) {
  return <div className={className}>GovMain</div>;
}

export default styled(GovMainBase)`
  // TODO
`;
