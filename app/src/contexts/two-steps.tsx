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
import { useConfirm } from '@nebula-js/ui';
import { TwoStepsEnum } from 'pages/clusters/components/TwoSteps';
import { u, Token } from '@nebula-js/types';
import { useConnectedWallet } from '@terra-money/use-wallet';

export interface TwoStepsProps {
  children: ReactNode;
}

export interface TwoStepsState {
  step: TwoStepsEnum;
  tokenAmounts: u<Token>[];
  resetAndBackToStep1: () => void;
  onStep1Succeed: (value: u<Token>[]) => void;
  validateAndNavigate: (navigate: () => void) => void;
}

// @ts-ignore
const TwoSteps: Context<TwoStepsState> = createContext<TwoStepsState>();

const WARNING_MESSAGE = "You're on process. Are you sure you want to leave?";

export function TwoStepsProvider({ children }: TwoStepsProps) {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const connectedWallet = useConnectedWallet();

  const [openConfirm, confirmElement] = useConfirm();

  // ---------------------------------------------
  // states
  // ---------------------------------------------
  const [step, setStep] = useState<TwoStepsEnum>(TwoStepsEnum.STEP1);

  const [tokenAmounts, setTokenAmounts] = useState<u<Token>[]>([
    '10230' as u<Token>,
  ]);

  // ---------------------------------------------
  // callbacks
  // ---------------------------------------------
  const resetAndBackToStep1 = useCallback(() => {
    setTokenAmounts([]);
    setStep(TwoStepsEnum.STEP1);
  }, [setStep, setTokenAmounts]);

  const onStep1Succeed = useCallback(
    (amounts: u<Token>[]) => {
      setTokenAmounts(amounts);
      setStep(TwoStepsEnum.STEP2);
    },
    [setTokenAmounts, setStep],
  );

  const validateAndNavigate = useCallback(
    async (navigate) => {
      if (step === TwoStepsEnum.STEP2) {
        const confirm = await openConfirm({
          description: WARNING_MESSAGE,
          agree: 'Leave',
          disagree: 'Cancel',
        });

        if (confirm) {
          resetAndBackToStep1();
          navigate();
        }
      } else {
        navigate();
      }
    },
    [step, openConfirm, resetAndBackToStep1],
  );

  // ---------------------------------------------
  // side effects
  // ---------------------------------------------

  // warning when user close tab or change route directly
  useEffect(() => {
    function callback(event: BeforeUnloadEvent) {
      event.preventDefault();
      return (event.returnValue = WARNING_MESSAGE);
    }

    if (step === TwoStepsEnum.STEP2) {
      window.addEventListener('beforeunload', callback);
    }

    return () => {
      window.removeEventListener('beforeunload', callback);
    };
  }, [step]);

  // warning when user go back or forward
  // useEffect(() => {
  //   async function callback(event: PopStateEvent) {
  //     if (tokenAmounts.length > 0) {
  //       const confirm = await openConfirm({
  //         description: WARNING_MESSAGE,
  //         agree: 'Leave',
  //         disagree: 'Cancel',
  //       });

  //       console.log(event);

  //       if (confirm) {
  //         history.back();
  //         resetAndBackToStep1();
  //       } else {
  //         // Stay on the current page.
  //         history.pushState(null, '', window.location.pathname);
  //       }
  //     }
  //   }

  //   if (step === TwoStepsEnum.STEP1) {
  //     window.addEventListener('popstate', callback);
  //   }

  //   return () => {
  //     window.removeEventListener('popstate', callback);
  //   };
  // }, [step]);

  // clear the data when user disconnect
  useEffect(() => {
    if (!connectedWallet) resetAndBackToStep1();
  }, [connectedWallet, resetAndBackToStep1]);

  return (
    <TwoSteps.Provider
      value={{
        step,
        tokenAmounts,
        resetAndBackToStep1,
        onStep1Succeed,
        validateAndNavigate,
      }}
    >
      {children}
      {confirmElement}
    </TwoSteps.Provider>
  );
}

export function useTwoSteps(): TwoStepsState {
  return useContext(TwoSteps);
}

export const TwoStepsConsumer: Consumer<TwoStepsState> = TwoSteps.Consumer;
