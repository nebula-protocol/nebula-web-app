import { AppProvider } from '@libs/app-provider';
import { patchReactQueryFocusRefetching } from '@libs/patch-react-query-focus-refetching';
import { GoogleAnalytics } from '@libs/use-google-analytics';
import { RouterScrollRestoration } from '@libs/use-router-scroll-restoration';
import { captureException } from '@sentry/react';
import { ReadonlyWalletSession } from '@terra-dev/readonly-wallet';
import { NetworkInfo } from '@terra-dev/wallet-types';
import {
  WalletControllerChainOptions,
  WalletProvider,
} from '@terra-money/wallet-provider';
import { useReadonlyWalletDialog } from 'components/dialogs/useReadonlyWalletDialog';
import { StyleProviders } from 'configurations/style';
import { TxBroadcastProvider } from 'contexts/tx-broadcast';

import React, { ReactNode, useCallback } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter as Router } from 'react-router-dom';
import {
  GA_TRACKING_ID,
  NEBULA_TX_REFETCH_MAP,
  nebulaConstants,
  nebulaContractAddress,
  nebulaDefaultWasmClient,
  ON_PRODUCTION,
} from './env';

patchReactQueryFocusRefetching();

const queryClient = new QueryClient();

const errorReporter =
  process.env.NODE_ENV === 'production' ? captureException : undefined;

export interface ProvidersProps extends WalletControllerChainOptions {
  children: ReactNode;
}

export function Providers({ children, ...chainOptions }: ProvidersProps) {
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
      {...chainOptions}
      connectorOpts={{
        bridge: ON_PRODUCTION
          ? 'https://walletconnect.terra.dev/'
          : 'https://tequila-walletconnect.terra.dev/',
      }}
      createReadonlyWalletSession={createReadonlyWalletSession}
    >
      <Router>
        <QueryClientProvider client={queryClient}>
          <AppProvider
            defaultWasmClient={nebulaDefaultWasmClient}
            contractAddress={nebulaContractAddress}
            constants={nebulaConstants}
            refetchMap={NEBULA_TX_REFETCH_MAP}
            txErrorReporter={errorReporter}
            queryErrorReporter={errorReporter}
          >
            {typeof GA_TRACKING_ID === 'string' && (
              <GoogleAnalytics trackingId={GA_TRACKING_ID} />
            )}
            <RouterScrollRestoration />
            <StyleProviders>
              <TxBroadcastProvider>{children}</TxBroadcastProvider>
              {readonlyWalletSelectorElement}
            </StyleProviders>
          </AppProvider>
        </QueryClientProvider>
      </Router>
    </WalletProvider>
  );
}
