import {
  NEBULA_TX_REFETCH_MAP,
  NebulaWebappProvider,
} from '@nebula-js/webapp-provider';
import { captureException } from '@sentry/react';
import { patchReactQueryFocusRefetching } from '@terra-dev/patch-react-query-focus-refetching';
import { BrowserInactiveProvider } from '@terra-dev/use-browser-inactive';
import { GoogleAnalytics } from '@terra-dev/use-google-analytics';
import { RouterScrollRestoration } from '@terra-dev/use-router-scroll-restoration';
import { WalletProvider } from '@terra-money/wallet-provider';
import {
  BankProvider,
  TerraWebappProvider,
} from '@terra-money/webapp-provider';
import { ReactNode } from 'react';
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
  return (
    <WalletProvider
      defaultNetwork={DEFAULT_NETWORK}
      walletConnectChainIds={WALLETCONNECT_CHANNEL_IDS}
      connectorOpts={{
        bridge: ON_PRODUCTION
          ? 'https://walletconnect.terra.dev/'
          : 'https://tequila-walletconnect.terra.dev/',
      }}
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
                  <GoogleAnalytics trackingId={GA_TRACKING_ID} />
                  <RouterScrollRestoration />
                  {children}
                </NebulaWebappProvider>
              </BankProvider>
            </TerraWebappProvider>
          </BrowserInactiveProvider>
        </QueryClientProvider>
      </Router>
    </WalletProvider>
  );
}
