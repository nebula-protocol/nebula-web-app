import { CloseIcon, MenuIcon, WalletIcon } from '@nebula-js/icons';
import { buttonColorStyle, EmptyButton } from '@nebula-js/ui';
import {
  ConnectType,
  useWallet,
  WalletStatus,
} from '@terra-money/wallet-provider';
import logoImage from 'components/assets/nebula-wide.svg';
import { ViewAddressButton } from 'components/header/mobile/ViewAddressButton';
import React, { useCallback, useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { useWalletDetailDialog } from './useWalletDetailDialog';

export interface MobileHeaderProps {
  className?: string;
}

function MobileHeaderBase({ className }: MobileHeaderProps) {
  const { status, connect, isChromeExtensionCompatibleBrowser } = useWallet();

  const [openWalletDetail, walletDetailElement] = useWalletDetailDialog();

  const [open, setOpen] = useState<boolean>(false);

  const { pathname } = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const toggleWallet = useCallback(() => {
    if (status === WalletStatus.WALLET_CONNECTED) {
      openWalletDetail({});
    } else if (status === WalletStatus.WALLET_NOT_CONNECTED) {
      connect(
        isChromeExtensionCompatibleBrowser()
          ? ConnectType.EXTENSION
          : ConnectType.WALLETCONNECT,
      );
    }
  }, [connect, isChromeExtensionCompatibleBrowser, openWalletDetail, status]);

  const viewAddress = useCallback(() => {
    setOpen(false);

    if (status === WalletStatus.WALLET_NOT_CONNECTED) {
      connect(ConnectType.READONLY);
    }
  }, [connect, status]);

  return (
    <header className={className + ' dark-color-set'}>
      <section>
        <Link to="/">
          <img src={logoImage} alt="Nebula Protocol" />
        </Link>

        <div />

        <EmptyButton size={20} fontSize={20} onClick={toggleWallet}>
          <WalletIcon />
        </EmptyButton>

        <EmptyButton
          size={20}
          fontSize={open ? 12 : 18}
          onClick={() => setOpen(!open)}
        >
          {open ? <CloseIcon /> : <MenuIcon />}
        </EmptyButton>
      </section>
      {open && (
        <nav>
          <NavLink to="/clusters">Clusters</NavLink>
          <NavLink to="/staking">Staking</NavLink>
          <NavLink to="/gov">Governance</NavLink>
          <NavLink to="/my">My Page</NavLink>

          {status === WalletStatus.WALLET_NOT_CONNECTED && (
            <ViewAddressButton onClick={viewAddress} />
          )}
        </nav>
      )}
      {walletDetailElement}
    </header>
  );
}

const slide = keyframes`
  0% {
    transform: translateY(-100%);
    opacity: 0.7;
  }
  
  100% {
    transform: translateY(0);
    opacity: 1;
  }
`;

export const MobileHeader = styled(MobileHeaderBase)`
  section {
    position: relative;
    z-index: 2;
    background-color: var(--color-gray08);

    height: 54px;
    padding: 0 16px;
    gap: 20px;

    display: flex;
    align-items: center;

    > div:empty {
      flex: 1;
    }

    button {
      ${buttonColorStyle('dim')};

      background-color: transparent;
    }
  }

  nav {
    position: fixed;
    z-index: 1;

    padding: 20px 16px;

    width: 100vw;
    min-height: 100vh;
    max-height: 100vh;

    animation: ${slide} 0.3s cubic-bezier(0.655, 1.075, 0.8, 0.995);

    background-color: var(--color-gray08);

    display: flex;
    flex-direction: column;
    gap: 20px;

    a {
      font-size: 32px;
      text-decoration: none;

      color: var(--color-white44);

      &.active {
        color: var(--color-white92);
      }
    }
  }
`;
