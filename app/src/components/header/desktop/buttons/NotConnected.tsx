import { ClickAwayListener, Popper } from '@material-ui/core';
import {
  ChevronRightIcon,
  TerraIcon,
  WalletconnectIcon,
  WalletIcon,
} from '@nebula-js/icons';
import {
  buttonColorStyle,
  EmptyButton,
  EmptyButtonProps,
  EmptyIconHolder,
} from '@nebula-js/ui';
import {
  ConnectType,
  useWallet,
  WalletStatus,
} from '@terra-money/wallet-provider';
import React, { useState } from 'react';
import styled from 'styled-components';
import { dropdownContainerStyle } from '../styles';
import { walletButtonMeasure } from './walletButtonMeasure';

export interface NotConnectedProps
  extends Omit<EmptyButtonProps, 'ref' | 'children'> {}

function NotConnectedBase({ ...buttonProps }: NotConnectedProps) {
  const {
    status,
    availableConnectTypes,
    availableInstallTypes,
    connect,
    install,
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
          <Dropdown>
            <h2>Connect</h2>
            {availableConnectTypes.includes(ConnectType.WALLETCONNECT) && (
              <ConnectButton onClick={() => connect(ConnectType.WALLETCONNECT)}>
                <span>Terra Station Mobile</span>
                <WalletconnectIcon />
              </ConnectButton>
            )}
            {availableConnectTypes.includes(ConnectType.EXTENSION) && (
              <ConnectButton onClick={() => connect(ConnectType.EXTENSION)}>
                <span>Terra Station Extension</span>
                <TerraIcon />
              </ConnectButton>
            )}
            {availableInstallTypes.includes(ConnectType.EXTENSION) && (
              <ConnectButton onClick={() => install(ConnectType.EXTENSION)}>
                <span>Install Station Extension</span>
                <TerraIcon />
              </ConnectButton>
            )}
            {availableConnectTypes.includes(ConnectType.READONLY) && (
              <>
                <hr />
                <AddressButton onClick={() => connect(ConnectType.READONLY)}>
                  View Address
                </AddressButton>
              </>
            )}
          </Dropdown>
        </Popper>
      </div>
    </ClickAwayListener>
  );
}

const ConnectButton = styled(EmptyButton)`
  display: flex;
  justify-content: space-between;
  align-items: center;

  ${buttonColorStyle('dark')};

  svg {
    transform: scale(1.1);
  }
`;

const AddressButton = styled(EmptyButton)`
  display: grid;
  place-content: center;

  ${buttonColorStyle('dim')};
`;

const Dropdown = styled.div`
  ${dropdownContainerStyle};

  h2 {
    font-size: 16px;
    text-align: center;
    color: var(--color-white92);

    margin-bottom: 20px;
  }

  button {
    padding: 0 16px;
    border-radius: 8px;
    margin: 12px 0;

    width: 100%;
    min-width: 212px;
    min-height: 42px;

    font-size: 12px;

    &:last-child {
      margin-bottom: 0;
    }
  }

  hr {
    border: 0;
    border-top: 1px solid var(--color-gray08);
    margin: 16px 0;
  }
`;

export const NotConnected = styled(NotConnectedBase)`
  ${walletButtonMeasure};

  transition: border-color 0.3s ease-out, color 0.3s ease-out;

  border: 1px solid var(--color-gray24);

  color: var(--color-paleblue);

  &:hover {
    color: hsl(
      var(--color-paleblue-h),
      var(--color-paleblue-s),
      calc(var(--color-paleblue-l) + 15%)
    );
    border-color: var(--color-paleblue);
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
