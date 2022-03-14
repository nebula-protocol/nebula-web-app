import { AppProvider } from '@libs/app-provider';
import { patchReactQueryFocusRefetching } from '@libs/patch-react-query-focus-refetching';
import { RouterScrollRestoration } from '@libs/use-router-scroll-restoration';
import { captureException } from '@sentry/react';
import { ReadonlyWalletSession } from '@terra-money/wallet-provider';
import { NetworkInfo } from '@terra-money/use-wallet';
import {
  WalletControllerChainOptions,
  WalletProvider,
} from '@terra-money/wallet-provider';
import { useReadonlyWalletDialog } from 'components/dialogs/useReadonlyWalletDialog';
import { StyleProviders } from 'configurations/style';
import { TxBroadcastProvider } from 'contexts/tx-broadcast';
import { TwoStepsProvider } from 'contexts/two-steps';
import React, { ReactNode, useCallback } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter as Router } from 'react-router-dom';
import {
  NEBULA_CONSTANTS,
  NEBULA_CONTRACT_ADDRESS,
  NEBULA_DEFAULT_WASM_CLIENT,
  NEBULA_TX_REFETCH_MAP,
  WALLETCONNECT_BRIDGE_SERVER,
} from '../env';
import { NEBULA_DEFAULT_LCD_WASM_CLIENT } from '@nebula-js/app-provider';

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
        bridge: WALLETCONNECT_BRIDGE_SERVER,
      }}
      createReadonlyWalletSession={createReadonlyWalletSession}
    >
      <Router>
        <QueryClientProvider client={queryClient}>
          <AppProvider
            defaultQueryClient={NEBULA_DEFAULT_WASM_CLIENT}
            lcdQueryClient={NEBULA_DEFAULT_LCD_WASM_CLIENT}
            contractAddress={NEBULA_CONTRACT_ADDRESS}
            constants={NEBULA_CONSTANTS}
            refetchMap={NEBULA_TX_REFETCH_MAP}
            txErrorReporter={errorReporter}
            queryErrorReporter={errorReporter}
          >
            <RouterScrollRestoration />
            <StyleProviders>
              <TxBroadcastProvider>
                <TwoStepsProvider>{children}</TwoStepsProvider>
              </TxBroadcastProvider>
              {readonlyWalletSelectorElement}
            </StyleProviders>
          </AppProvider>
        </QueryClientProvider>
      </Router>
    </WalletProvider>
  );
}
