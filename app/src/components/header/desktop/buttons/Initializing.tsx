import { WalletIcon } from '@nebula-js/icons';
import { EmptyButton, EmptyButtonProps, EmptyIconHolder } from '@nebula-js/ui';
import React from 'react';
import styled from 'styled-components';
import { walletButtonMeasure } from './walletButtonMeasure';

export interface InitializingProps
  extends Omit<EmptyButtonProps, 'ref' | 'children'> {}

function InitializingBase({ ...buttonProps }: InitializingProps) {
  return (
    <EmptyButton {...buttonProps}>
      <EmptyIconHolder fontSize={16}>
        <WalletIcon />
      </EmptyIconHolder>
      Initializing...
    </EmptyButton>
  );
}

export const Initializing = styled(InitializingBase)`
  ${walletButtonMeasure};

  cursor: none;

  border: 1px solid var(--color-gray24);
  color: var(--color-gray24);

  display: flex;
  align-items: center;

  > :first-child {
    margin-right: 11px;
    width: 14px;
  }
`;
