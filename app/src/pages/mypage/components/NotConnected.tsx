import React from 'react';
import styled from 'styled-components';
import { TerraIcon, WalletconnectIcon } from '@nebula-js/icons';
import { MainLayout } from '../../../components/layouts/MainLayout';
import { useWallet, ConnectType, WalletStatus } from '@terra-money/use-wallet';
import { Section } from '../../../@nebula-js/ui';
import { Title } from '../../../components/common/Title';

const NotConnected = () => {
  const {
    status,
    availableConnectTypes,
    availableInstallTypes,
    connect,
    install,
  } = useWallet();

  if (status !== WalletStatus.WALLET_NOT_CONNECTED) {
    return null;
  }

  return (
    <MainLayout>
      <Title>My Page</Title>
      <StyledSection>
        <p>Connect</p>
        <div>
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
        </div>
      </StyledSection>
    </MainLayout>
  );
};

const StyledSection = styled(Section)`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  > p {
    font-size: var(--font-size20);
    font-weight: 500;
    margin-bottom: 32px;
  }
  > div {
    display: flex;
    flex-direction: column;
    gap: 16px;
    max-width: 500px;
    width: 100%;
  }
`;

const ConnectButton = styled.section`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  padding: 18px 28px;
  border-radius: 8px;
  background-color: var(--color-gray11);
  font-size: var(--font-size16-14);
  color: var(--color-blue01);
  font-weight: 500;
`;

export { NotConnected };
