import { ClickAwayListener, Popper } from '@material-ui/core';
import { ChevronRightIcon, WalletIcon } from '@nebula-js/icons';
import {
  demicrofy,
  formatTokenWithPostfixUnits,
  truncate,
} from '@nebula-js/notation';
import { EmptyButton, EmptyButtonProps, EmptyIconHolder } from '@nebula-js/ui';
import { NebulaTokenBalances } from '@nebula-js/webapp-fns';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useBank } from '@terra-money/webapp-provider';
import React, { useState } from 'react';
import styled from 'styled-components';
import { dropdownContainerStyle } from '../../styles';
import { walletButtonMeasure } from './walletButtonMeasure';

export interface ConnectedProps
  extends Omit<EmptyButtonProps, 'ref' | 'children'> {}

function ConnectedBase({ ...buttonProps }: ConnectedProps) {
  const connectedWallet = useConnectedWallet();

  const {
    tokenBalances: { uUST },
  } = useBank<NebulaTokenBalances>();

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
        >
          <Dropdown>
            <h2>{truncate(connectedWallet.walletAddress)}</h2>
          </Dropdown>
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
