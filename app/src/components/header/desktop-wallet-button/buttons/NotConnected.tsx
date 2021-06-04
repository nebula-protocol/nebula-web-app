import { ClickAwayListener, Popper } from '@material-ui/core';
import { ChevronRightIcon, WalletIcon } from '@nebula-js/icons';
import { EmptyButton, EmptyButtonProps, EmptyIconHolder } from '@nebula-js/ui';
import { useWallet, WalletStatus } from '@terra-money/wallet-provider';
import React, { useState } from 'react';
import styled from 'styled-components';
import { walletButtonMeasure } from './walletButtonMeasure';

export interface NotConnectedProps
  extends Omit<EmptyButtonProps, 'ref' | 'children'> {}

function NotConnectedBase({ ...buttonProps }: NotConnectedProps) {
  const {
    status,
    //availableConnectTypes,
    //availableInstallTypes,
    //connect,
  } = useWallet();

  const [anchorElement, setAnchorElement] = useState<HTMLElement | null>(null);

  if (status !== WalletStatus.WALLET_NOT_CONNECTED) {
    return null;
  }

  const openDropdown = !!anchorElement;

  return (
    <ClickAwayListener onClickAway={() => setAnchorElement(null)}>
      <div>
        <div>
          <EmptyButton
            {...buttonProps}
            onClick={({ currentTarget }) => {
              setAnchorElement((prev) => (prev ? null : currentTarget));
            }}
          >
            <EmptyIconHolder fontSize={16}>
              <WalletIcon />
            </EmptyIconHolder>
            Connect
            <EmptyIconHolder fontSize={8}>
              <ChevronRightIcon />
            </EmptyIconHolder>
          </EmptyButton>
        </div>

        <Popper
          open={openDropdown}
          anchorEl={anchorElement}
          placement="bottom-end"
        >
          <div>Hello?</div>
        </Popper>
      </div>
    </ClickAwayListener>
  );
}

export const NotConnected = styled(NotConnectedBase)`
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
