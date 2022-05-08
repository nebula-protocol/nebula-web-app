import React from 'react';
import styled from 'styled-components';
import { MainLayout } from '../../../components/layouts/MainLayout';
import { useWallet, ConnectType, WalletStatus } from '@terra-money/use-wallet';
import { Section } from '../../../@nebula-js/ui';
import { Title } from '../../../components/common/Title';

const NotConnected = () => {
  const {
    status,
    availableConnectTypes,
    availableConnections,
    availableInstallations,
    connect,
  } = useWallet();

  if (status !== WalletStatus.WALLET_NOT_CONNECTED) {
    return null;
  }

  const install = (url: string) => {
    window.open(url, '_blank', 'noreferrer');
  };

  return (
    <MainLayout>
      <Title>My Page</Title>
      <StyledSection>
        <p>Connect</p>
        <div>
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
          <Divider />
          {availableConnectTypes.includes(ConnectType.READONLY) && (
            <AddressButton onClick={() => connect(ConnectType.READONLY)}>
              View Address
            </AddressButton>
          )}
        </div>
      </StyledSection>
    </MainLayout>
  );
};

const Divider = styled.hr`
  border-color: var(--color-gray08);
`;

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

  img {
    width: 1.4em;
  }
`;

const AddressButton = styled(ConnectButton)`
  justify-content: center;
  color: var(--color-white64);
`;

export { NotConnected };
