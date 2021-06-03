import { ChevronRightIcon, WalletIcon } from '@nebula-js/icons';
import React from 'react';
import styled from 'styled-components';

export interface WalletProps {
  className?: string;
}

function WalletBase({ className }: WalletProps) {
  return (
    <div className={className}>
      <WalletIcon />
      Connect
      <ChevronRightIcon />
    </div>
  );
}

export const Wallet = styled(WalletBase)`
  display: flex;
  align-items: center;

  border: 1px solid ${({ theme }) => theme.colors.gray24};
  border-radius: 17px;
  height: 32px;

  font-size: 11px;

  padding: 0 17px;

  cursor: pointer;
  user-select: none;

  > :first-child {
    margin-right: 11px;
    width: 14px;
  }

  > :last-child {
    margin-left: 22px;
  }
`;
