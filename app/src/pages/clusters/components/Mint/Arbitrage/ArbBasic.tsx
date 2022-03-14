import React from 'react';
import { ClusterInfo } from '@nebula-js/app-fns';
import { MultiBuy } from '../MultiBuy';
import { TwoSteps, TwoStepsEnum } from '../../TwoSteps';
import { useTwoSteps } from 'contexts/two-steps';
import { MintArbBasicArbitrage } from './ArbBasicArbitrage';

export interface MintArbBasicProps {
  className?: string;
  clusterInfo: ClusterInfo;
}

export function MintArbBasic({ className, clusterInfo }: MintArbBasicProps) {
  const { step, resetAndBackToStep1 } = useTwoSteps();

  return (
    <div className={className}>
      <TwoSteps
        step1Info={{
          title: 'SWAP',
          description: '1. Purchase inventory assets to arbitrage with',
        }}
        step2Info={{
          title: 'ARB',
          description: '2. Arbitrage on Astroport',
        }}
        step={step}
      />

      {step === TwoStepsEnum.STEP1 ? (
        <MultiBuy clusterInfo={clusterInfo} />
      ) : (
        <MintArbBasicArbitrage
          clusterInfo={clusterInfo}
          resetAndBackToSwap={resetAndBackToStep1}
        />
      )}
    </div>
  );
}
