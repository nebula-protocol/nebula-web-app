import {
  AppConstants,
  AppContractAddress,
  GasPrice,
  lastSyncedHeightQuery,
} from '@libs/app-fns';
import { defaultLcdFetch, LCDFetch } from '@libs/app-fns/clients/lcd';
import { defaultMantleFetch, MantleFetch } from '@libs/mantle';
import { useWallet } from '@terra-dev/use-wallet';
import { NetworkInfo } from '@terra-dev/wallet-types';
import React, {
  Consumer,
  Context,
  createContext,
  ReactNode,
  useContext,
  useMemo,
} from 'react';
import {
  defaultFallbackGasPrice,
  defaultGasPriceEndpoint,
  defaultLcdEndpoint,
  defaultMantleEndpoint,
} from '../env';
import { useGasPriceQuery } from '../queries/gasPrice';
import { TxRefetchMap } from '../types';

export interface AppProviderProps<
  ContractAddress extends AppContractAddress,
  Constants extends AppConstants,
> {
  children: ReactNode;

  contractAddress: (network: NetworkInfo) => ContractAddress;
  constants: (network: NetworkInfo) => Constants;

  lcdEndpoint?: (network: NetworkInfo) => string;
  lcdFetch?: LCDFetch;

  mantleEndpoint?: (network: NetworkInfo) => string;
  mantleFetch?: MantleFetch;

  // gas
  gasPriceEndpoint?: (network: NetworkInfo) => string;
  fallbackGasPrice?: (network: NetworkInfo) => GasPrice;

  // refetch map
  refetchMap: TxRefetchMap;

  // sentry captureException()
  txErrorReporter?: (error: unknown) => string;

  // sentry captureException()
  queryErrorReporter?: (error: unknown) => void;
}

export interface App<
  ContractAddress extends AppContractAddress,
  Constants extends AppConstants,
> {
  contractAddress: ContractAddress;
  constants: Constants;

  // functions
  lastSyncedHeight: () => Promise<number>;

  lcdEndpoint: string;
  lcdFetch: LCDFetch;

  mantleEndpoint: string;
  mantleFetch: MantleFetch;

  // gas
  gasPrice: GasPrice;

  // refetch map
  refetchMap: TxRefetchMap;

  // sentry captureException()
  txErrorReporter?: (error: unknown) => string;

  // sentry captureException()
  queryErrorReporter?: (error: unknown) => void;
}

//@ts-ignore
const AppContext: Context<App<any, any>> = createContext<App<any, any>>();

export function AppProvider<
  ContractAddress extends AppContractAddress,
  Constants extends AppConstants,
>({
  children,
  contractAddress,
  constants,
  lcdEndpoint = defaultLcdEndpoint,
  lcdFetch = defaultLcdFetch,
  mantleEndpoint = defaultMantleEndpoint,
  mantleFetch = defaultMantleFetch,
  gasPriceEndpoint = defaultGasPriceEndpoint,
  fallbackGasPrice = defaultFallbackGasPrice,
  queryErrorReporter,
  txErrorReporter,
  refetchMap,
}: AppProviderProps<ContractAddress, Constants>) {
  const { network } = useWallet();

  const networkBoundStates = useMemo<
    Pick<
      App<any, any>,
      'contractAddress' | 'constants' | 'lcdEndpoint' | 'mantleEndpoint'
    >
  >(() => {
    return {
      contractAddress: contractAddress(network),
      constants: constants(network),
      lcdEndpoint: lcdEndpoint(network),
      mantleEndpoint: mantleEndpoint(network),
    };
  }, [constants, contractAddress, lcdEndpoint, mantleEndpoint, network]);

  const lastSyncedHeight = useMemo(() => {
    return () =>
      lastSyncedHeightQuery({
        mantleEndpoint: networkBoundStates.mantleEndpoint,
        mantleFetch,
      });
  }, [mantleFetch, networkBoundStates.mantleEndpoint]);

  const {
    data: gasPrice = fallbackGasPrice(network) ?? fallbackGasPrice(network),
  } = useGasPriceQuery(
    gasPriceEndpoint(network) ?? gasPriceEndpoint(network),
    queryErrorReporter,
  );

  const states = useMemo<App<any, any>>(() => {
    return {
      ...networkBoundStates,
      lastSyncedHeight,
      lcdFetch,
      mantleFetch,
      txErrorReporter,
      queryErrorReporter,
      gasPrice,
      refetchMap,
    };
  }, [
    gasPrice,
    lastSyncedHeight,
    lcdFetch,
    mantleFetch,
    networkBoundStates,
    queryErrorReporter,
    refetchMap,
    txErrorReporter,
  ]);

  return <AppContext.Provider value={states}>{children}</AppContext.Provider>;
}

export function useApp<
  ContractAddress extends AppContractAddress = AppContractAddress,
  Constants extends AppConstants = AppConstants,
>(): App<ContractAddress, Constants> {
  return useContext(AppContext);
}

export const AppConsumer: Consumer<App<any, any>> = AppContext.Consumer;
