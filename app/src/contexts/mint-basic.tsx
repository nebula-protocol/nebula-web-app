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
  const connectedWallet = useConnectedWallet();

  const [step, setStep] = useState<BasicStepsEnum>(BasicStepsEnum.SWAP);

  const [providedAmounts, setProvidedAmounts] = useState<u<Token>[]>([]);

  const [clusterAddr, setClusterAddr] = useState<string | null>(null);

  const resetProvidedAmounts = useCallback(
    () => setProvidedAmounts([]),
    [setProvidedAmounts],
  );

  const goToMint = () => setStep(BasicStepsEnum.MINT);

  const resetAndBackToSwap = useCallback(() => {
    setClusterAddr(null);
    setStep(BasicStepsEnum.SWAP);
    resetProvidedAmounts();
  }, [setClusterAddr, setStep, resetProvidedAmounts]);

  const { pathname } = useLocation();

  const match = matchPath<{ address: string }>(pathname, {
    path: '/clusters/:address',
    exact: false,
    strict: false,
  });

  const onSwapSucceed = (amounts: u<Token>[]) => {
    goToMint();
    setProvidedAmounts(amounts);
    setClusterAddr(match!.params.address);
  };

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
