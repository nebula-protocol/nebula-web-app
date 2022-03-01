import type { ReactNode } from 'react';
import React, {
  useState,
  Consumer,
  Context,
  createContext,
  useContext,
  useEffect,
  useCallback,
} from 'react';
import { BasicStepsEnum } from 'pages/clusters/components/Mint/basic/BasicSteps';
import { u, Token } from '@nebula-js/types';
import { matchPath, useLocation } from 'react-router';
import { useConnectedWallet } from '@terra-money/use-wallet';

export interface MintBasicProps {
  children: ReactNode;
}

export interface MintBasicState {
  step: BasicStepsEnum;
  resetAndBackToSwap: () => void;
  providedAmounts: u<Token>[];
  onSwapSucceed: (value: u<Token>[]) => void;
}

// @ts-ignore
const MintBasic: Context<MintBasicState> = createContext<MintBasicState>();

export function MintBasicProvider({ children }: MintBasicProps) {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const connectedWallet = useConnectedWallet();

  const { pathname } = useLocation();

  // ---------------------------------------------
  // states
  // ---------------------------------------------

  const [step, setStep] = useState<BasicStepsEnum>(BasicStepsEnum.SWAP);

  const [providedAmounts, setProvidedAmounts] = useState<u<Token>[]>([]);

  const [clusterAddr, setClusterAddr] = useState<string | null>(null);

  // ---------------------------------------------
  // logics
  // ---------------------------------------------
  const match = matchPath<{ address: string }>(pathname, {
    path: '/clusters/:address',
    exact: false,
    strict: false,
  });

  // ---------------------------------------------
  // callbacks
  // ---------------------------------------------

  const resetAndBackToSwap = useCallback(() => {
    setProvidedAmounts([]);
    setClusterAddr(null);
    setStep(BasicStepsEnum.SWAP);
  }, [setClusterAddr, setStep, setProvidedAmounts]);

  const onSwapSucceed = (amounts: u<Token>[]) => {
    setProvidedAmounts(amounts);
    setClusterAddr(match!.params.address);
    setStep(BasicStepsEnum.MINT);
  };

  // ---------------------------------------------
  // side effects
  // ---------------------------------------------
  useEffect(() => {
    function callback(event: BeforeUnloadEvent) {
      event.preventDefault();
      return (event.returnValue =
        "You're on minting process. Are you sure you want to close?");
    }

    if (step === BasicStepsEnum.MINT) {
      window.addEventListener('beforeunload', callback);
    }

    return () => {
      window.removeEventListener('beforeunload', callback);
    };
  }, [step]);

  useEffect(() => {
    if (providedAmounts.length > 0 && !!clusterAddr) {
      if (!match || (match && match.params.address !== clusterAddr)) {
        resetAndBackToSwap();
      }
    }
  }, [match, clusterAddr, providedAmounts.length, resetAndBackToSwap]);

  useEffect(() => {
    if (!connectedWallet) resetAndBackToSwap();
  }, [connectedWallet, resetAndBackToSwap]);

  return (
    <MintBasic.Provider
      value={{
        step,
        providedAmounts,
        resetAndBackToSwap,
        onSwapSucceed,
      }}
    >
      {children}
    </MintBasic.Provider>
  );
}

export function useMintBasic(): MintBasicState {
  return useContext(MintBasic);
}

export const MintBasicConsumer: Consumer<MintBasicState> = MintBasic.Consumer;
