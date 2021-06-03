import { GlobalStyle } from '@nebula-js/ui';
import { useWallet, WalletStatus } from '@terra-money/wallet-provider';
import { Header } from 'components/header';
import { MainLayout } from 'components/layouts/MainLayout';
import { AppProviders } from 'configurations/app';
import { ThemeProvider } from 'contexts/theme';
import * as React from 'react';
import { render } from 'react-dom';

function App() {
  const {
    network,
    wallets,
    availableConnectTypes,
    connect,
    disconnect,
    status,
  } = useWallet();

  return (
    <div>
      <Header />

      <MainLayout>
        <header>
          <h1>Hello Nebula!</h1>
        </header>

        <article>
          <pre>{JSON.stringify(network, null, 2)}</pre>
          <pre>{JSON.stringify(wallets, null, 2)}</pre>
        </article>

        <footer>
          {status === WalletStatus.WALLET_NOT_CONNECTED &&
            availableConnectTypes.map((connectType) => {
              return (
                <button key={connectType} onClick={() => connect(connectType)}>
                  {connectType}
                </button>
              );
            })}

          {status === WalletStatus.WALLET_CONNECTED && (
            <button onClick={() => disconnect()}>Disconnect</button>
          )}
        </footer>
      </MainLayout>
    </div>
  );
}

render(
  <AppProviders>
    <ThemeProvider>
      <GlobalStyle />
      <App />
    </ThemeProvider>
  </AppProviders>,
  document.querySelector('#root'),
);
