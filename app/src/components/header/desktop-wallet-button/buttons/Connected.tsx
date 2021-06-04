import { ChevronRightIcon, WalletIcon } from '@nebula-js/icons';
import { EmptyButton, EmptyButtonProps, EmptyIconHolder } from '@nebula-js/ui';
import React from 'react';
import styled from 'styled-components';
import { walletButtonMeasure } from './walletButtonMeasure';

export interface ConnectedProps
  extends Omit<EmptyButtonProps, 'ref' | 'children'> {}

function ConnectedBase({ ...buttonProps }: ConnectedProps) {
  return (
    <EmptyButton {...buttonProps}>
      <EmptyIconHolder fontSize={16}>
        <WalletIcon />
      </EmptyIconHolder>
      200,000 UST
      <EmptyIconHolder fontSize={8}>
        <ChevronRightIcon />
      </EmptyIconHolder>
    </EmptyButton>
  );
}

export const Connected = styled(ConnectedBase)`
  ${walletButtonMeasure};

  border: 1px solid ${({ theme }) => theme.colors.gray24};
  color: #24deff;

  &:hover {
    border-color: #23bed9;
  }

  display: flex;
  align-items: center;

  > :first-child {
    margin-right: 11px;
    width: 14px;
  }

  > :last-child {
    margin-left: 22px;
  }
`;
