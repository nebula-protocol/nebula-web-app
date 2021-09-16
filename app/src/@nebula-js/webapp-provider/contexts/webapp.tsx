import { useTerraWebapp } from '@libs/app-provider';
import { NebulaContractAddress, u, UST } from '@nebula-js/types';
import {
  DEFAULT_NEBULA_CONSTANTS,
  DEFAULT_NEBULA_CONTRACT_ADDRESS,
  NebulaContants,
  NebulaContantsInput,
} from '@nebula-js/webapp-fns';
import { useWallet } from '@terra-money/wallet-provider';
import big from 'big.js';
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
  contractAddress?: Record<string, NebulaContractAddress>;
  constants?: Record<string, NebulaContantsInput>;
}

export interface NebulaWebapp {
  contractAddress: NebulaContractAddress;
  constants: NebulaContants;
}

const NebulaWebappContext: Context<NebulaWebapp> =
  // @ts-ignore
  createContext<NebulaWebapp>();

export function NebulaWebappProvider({
  children,
  contractAddress = DEFAULT_NEBULA_CONTRACT_ADDRESS,
  constants = DEFAULT_NEBULA_CONSTANTS,
}: NebulaWebappProviderProps) {
  const { network } = useWallet();

  if (network.name === 'mainnet') {
    alert(`Now only support "testnet". please change your network.`);
  }

  const { gasPrice } = useTerraWebapp();

  const states = useMemo<NebulaWebapp>(() => {
    const constantsInput = constants[network.name] ?? constants['mainnet'];
    const calculateGasCalculated = {
      ...constantsInput,
      fixedFee: Math.floor(
        big(constantsInput.fixedGas).mul(gasPrice.uusd).toNumber(),
      ) as u<UST<number>>,
    };

    return {
      contractAddress:
        contractAddress[network.name] ?? contractAddress['mainnet'],
      constants: calculateGasCalculated,
    };
  }, [constants, network.name, gasPrice.uusd, contractAddress]);

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
