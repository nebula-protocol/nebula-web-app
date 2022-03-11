import { useUstBalance } from '@libs/app-provider';
import { demicrofy, formatTokenWithPostfixUnits } from '@libs/formatter';
import { ClickAwayListener, Grow, Popper } from '@material-ui/core';
import { ChevronRightIcon, WalletIcon } from '@nebula-js/icons';
import { EmptyButton, EmptyButtonProps, EmptyIconHolder } from '@nebula-js/ui';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import React, { useState } from 'react';
import styled from 'styled-components';
import { WalletDetails } from '../../wallet-details';
import { dropdownContainerStyle } from '../styles';
import { walletButtonMeasure } from './walletButtonMeasure';

export interface ConnectedProps
  extends Omit<EmptyButtonProps, 'ref' | 'children'> {}

function ConnectedBase({ ...buttonProps }: ConnectedProps) {
  const connectedWallet = useConnectedWallet();

  const uUST = useUstBalance(connectedWallet?.walletAddress);

  const [anchorElement, setAnchorElement] = useState<HTMLElement | null>(null);

  if (!connectedWallet) {
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
            {formatTokenWithPostfixUnits(demicrofy(uUST))} UST
            <EmptyIconHolder fontSize={8}>
              <ChevronRightIcon />
            </EmptyIconHolder>
          </EmptyButton>
        </div>

        <Popper
          open={openDropdown}
          anchorEl={anchorElement}
          placement="bottom-end"
          transition
          style={{ zIndex: 2 }}
        >
          {({ TransitionProps }) => (
            <Grow
              {...TransitionProps}
              style={{ transformOrigin: 'top right' }}
              timeout={200}
            >
              <Dropdown>
                <WalletDetails
                  buttonSize="small"
                  onExit={() => setAnchorElement(null)}
                />
              </Dropdown>
            </Grow>
          )}
        </Popper>
      </div>
    </ClickAwayListener>
  );
}

const Dropdown = styled.div`
  ${dropdownContainerStyle};
`;

export const Connected = styled(ConnectedBase)`
  ${walletButtonMeasure};

  border: 1px solid var(--color-gray24);
  color: var(--color-paleblue);

  &:hover {
    border-color: var(--color-paleblue);
    color: hsl(
      var(--color-paleblue-h),
      var(--color-paleblue-s),
      calc(var(--color-paleblue-l) + 15%)
    );
  }

  transition: border-color 0.3s ease-out, color 0.3s ease-out;

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
