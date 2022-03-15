import { ClusterInfo } from '@nebula-js/app-fns';
import { fixHMR } from 'fix-hmr';
import React from 'react';
import { useTwoSteps } from 'contexts/two-steps';
import { MultiBuy } from '../MultiBuy';
import { Mint } from './Mint';
import { TwoSteps, TwoStepsEnum } from '../../TwoSteps';

export interface MintBasicProps {
  className?: string;
  clusterInfo: ClusterInfo;
}

function MintBasicBase({ className, clusterInfo }: MintBasicProps) {
  const { step, resetAndBackToStep1 } = useTwoSteps();

  return (
    <div className={className}>
      <TwoSteps
        step={step}
        step1Info={{
          title: 'SWAP',
          description: '1. Purchase inventory assets to mint with',
        }}
        step2Info={{
          title: 'MINT',
          description: '2. Mint cluster tokens',
        }}
      />
      {step === TwoStepsEnum.STEP1 ? (
        <MultiBuy clusterInfo={clusterInfo} />
      ) : (
        <Mint
          clusterInfo={clusterInfo}
          resetAndBackToSwap={resetAndBackToStep1}
        />
      )}
    </div>
  );
}

export const MintBasic = fixHMR(MintBasicBase);
