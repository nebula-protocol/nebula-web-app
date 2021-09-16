import { patchReactQueryFocusRefetching } from '@libs/patch-react-query-focus-refetching';
import { BrowserInactiveProvider } from '@libs/use-browser-inactive';
import { GoogleAnalytics } from '@libs/use-google-analytics';
import { RouterScrollRestoration } from '@libs/use-router-scroll-restoration';
import { BankProvider, TerraWebappProvider } from '@libs/app-provider';
import {
  NEBULA_TX_REFETCH_MAP,
  NebulaWebappProvider,
} from '@nebula-js/webapp-provider';
import { captureException } from '@sentry/react';
import { ReadonlyWalletSession } from '@terra-dev/readonly-wallet';
import { NetworkInfo } from '@terra-dev/wallet-types';
import { WalletProvider } from '@terra-money/wallet-provider';
import { useReadonlyWalletDialog } from 'components/dialogs/useReadonlyWalletDialog';
import { StyleProviders } from 'configurations/style';
import { TxBroadcastProvider } from 'contexts/tx-broadcast';

import React, { ReactNode, useCallback } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter as Router } from 'react-router-dom';
import {
  CW20_TOKEN_CONTRACTS,
  DEFAULT_NETWORK,
  GA_TRACKING_ID,
  MAX_CAP_TOKEN_DENOMS,
  ON_PRODUCTION,
  WALLETCONNECT_CHANNEL_IDS,
} from './env';

patchReactQueryFocusRefetching();

const queryClient = new QueryClient();

const errorReporter =
  process.env.NODE_ENV === 'production' ? captureException : undefined;

export function AppProviders({ children }: { children: ReactNode }) {
  const [openReadonlyWalletSelector, readonlyWalletSelectorElement] =
    useReadonlyWalletDialog();

  const createReadonlyWalletSession = useCallback(
    (networks: NetworkInfo[]): Promise<ReadonlyWalletSession | null> => {
      return openReadonlyWalletSelector({
        networks,
      });
    },
    [openReadonlyWalletSelector],
  );

  return (
    <WalletProvider
      defaultNetwork={DEFAULT_NETWORK}
      walletConnectChainIds={WALLETCONNECT_CHANNEL_IDS}
      connectorOpts={{
        bridge: ON_PRODUCTION
          ? 'https://walletconnect.terra.dev/'
          : 'https://tequila-walletconnect.terra.dev/',
      }}
      createReadonlyWalletSession={createReadonlyWalletSession}
    >
      <Router>
        <QueryClientProvider client={queryClient}>
          <BrowserInactiveProvider>
            <TerraWebappProvider
              txRefetchMap={NEBULA_TX_REFETCH_MAP}
              txErrorReporter={errorReporter}
              queryErrorReporter={errorReporter}
            >
              <BankProvider
                cw20TokenContracts={CW20_TOKEN_CONTRACTS}
                maxCapTokenDenoms={MAX_CAP_TOKEN_DENOMS}
              >
                <NebulaWebappProvider>
                  {GA_TRACKING_ID && (
                    <GoogleAnalytics trackingId={GA_TRACKING_ID} />
                  )}
                  <RouterScrollRestoration />
                  <StyleProviders>
                    <TxBroadcastProvider>{children}</TxBroadcastProvider>
                    {readonlyWalletSelectorElement}
                  </StyleProviders>
                </NebulaWebappProvider>
              </BankProvider>
            </TerraWebappProvider>
          </BrowserInactiveProvider>
        </QueryClientProvider>
      </Router>
    </WalletProvider>
  );
}
