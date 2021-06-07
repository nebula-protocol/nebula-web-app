import styled from 'styled-components';
import React from 'react';

export interface WalletDetailsProps {
  className?: string;
}

function WalletDetailsBase({ className }: WalletDetailsProps) {
  return <div className={className}>...</div>;
}

export const WalletDetails = styled(WalletDetailsBase)`
  // TODO
`;
