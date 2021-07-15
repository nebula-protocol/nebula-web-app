import { ContractAddress } from '@nebula-js/types';
import {
  AssetTokenIndex,
  DEFAULT_ASSET_TOKENS,
  DEFAULT_CONSTANTS,
  DEFAULT_CONTRACT_ADDRESS,
  NebulaContants,
} from '@nebula-js/webapp-fns';
import { useWallet } from '@terra-money/wallet-provider';
import React, {
  Consumer,
  Context,
  createContext,
  ReactNode,
  useContext,
  useMemo,
} from 'react';

export interface NebulaWebappProviderProps {
  children: ReactNode;
  contractAddress?: Record<string, ContractAddress>;
  constants?: Record<string, NebulaContants>;
  assetTokens?: Record<string, AssetTokenIndex>;
}

export interface NebulaWebapp {
  contractAddress: ContractAddress;
  constants: NebulaContants;
  assetTokens: AssetTokenIndex;
}

const NebulaWebappContext: Context<NebulaWebapp> =
  // @ts-ignore
  createContext<NebulaWebapp>();

export function NebulaWebappProvider({
  children,
  contractAddress = DEFAULT_CONTRACT_ADDRESS,
  constants = DEFAULT_CONSTANTS,
  assetTokens = DEFAULT_ASSET_TOKENS,
}: NebulaWebappProviderProps) {
  const { network } = useWallet();

  const states = useMemo<NebulaWebapp>(
    () => ({
      contractAddress:
        contractAddress[network.name] ?? contractAddress['mainnet'],
      constants: constants[network.name] ?? constants['mainnet'],
      assetTokens: assetTokens[network.name] ?? assetTokens['mainnet'],
    }),
    [contractAddress, network.name, constants, assetTokens],
  );

  return (
    <NebulaWebappContext.Provider value={states}>
      {children}
    </NebulaWebappContext.Provider>
  );
}

export function useNebulaWebapp(): NebulaWebapp {
  return useContext(NebulaWebappContext);
}

export const NebulaWebappConsumer: Consumer<NebulaWebapp> =
  NebulaWebappContext.Consumer;
