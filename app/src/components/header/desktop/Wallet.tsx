import { useWallet, WalletStatus } from '@terra-money/wallet-provider';
import { Connected } from './buttons/Connected';
import React from 'react';
import styled from 'styled-components';
import { Initializing } from './buttons/Initializing';
import { NotConnected } from './buttons/NotConnected';

export interface WalletProps {
  className?: string;
}

function WalletBase({ className }: WalletProps) {
  const { status } = useWallet();

  switch (status) {
    case WalletStatus.INITIALIZING:
      return <Initializing className={className} />;
    case WalletStatus.WALLET_NOT_CONNECTED:
      return <NotConnected className={className} />;
    case WalletStatus.WALLET_CONNECTED:
      return <Connected className={className} />;
  }

  return null;
}

export const Wallet = styled(WalletBase)``;
