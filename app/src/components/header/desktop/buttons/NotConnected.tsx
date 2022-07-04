import { ClickAwayListener, Popper } from '@material-ui/core';
import { ChevronRightIcon, WalletIcon } from '@nebula-js/icons';
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
    availableConnections,
    availableInstallations,
    connect,
  } = useWallet();

  const [anchorElement, setAnchorElement] = useState<HTMLElement | null>(null);

  if (status !== WalletStatus.WALLET_NOT_CONNECTED) {
    return null;
  }

  const openDropdown = !!anchorElement;

  const install = (url: string) => {
    window.open(url, '_blank', 'noreferrer');
  };

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

            {availableConnections
              .filter(({ type }) => type !== ConnectType.READONLY)
              .map(({ type, icon, name, identifier }) => (
                <ConnectButton
                  key={'connection' + type + identifier}
                  onClick={() => {
                    connect(type, identifier);
                  }}
                >
                  {name}
                  <img
                    src={
                      icon ===
                      'https://assets.terra.money/icon/station-extension/icon.png'
                        ? 'https://assets.terra.money/icon/wallet-provider/station.svg'
                        : icon
                    }
                    alt={name}
                  />
                </ConnectButton>
              ))}

            {availableInstallations
              .filter(({ type }) => type === ConnectType.EXTENSION)
              .map(({ type, identifier, name, icon, url }) => (
                <ConnectButton
                  key={'installation' + type + identifier}
                  onClick={() => {
                    install(url);
                  }}
                >
                  Install {name}
                  <img src={icon} alt={`Install ${name}`} />
                </ConnectButton>
              ))}

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

  img {
    transform: scale(1.3);
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
    color: var(--color-white2);

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
    border-top: 1px solid var(--color-gray1);
    margin: 16px 0;
  }
`;

export const NotConnected = styled(NotConnectedBase)`
  ${walletButtonMeasure};

  transition: border-color 0.3s ease-out, color 0.3s ease-out;

  border: 1px solid var(--color-gray6);

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
