import styled from 'styled-components';
import React from 'react';

export interface MyPageMainProps {
  className?: string;
}

function MyPageMainBase({ className }: MyPageMainProps) {
  return <div className={className}>MyPageMain</div>;
}

export default styled(MyPageMainBase)`
  // TODO
`;
