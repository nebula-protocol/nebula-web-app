import { ClusterInfo } from '@nebula-js/app-fns';
import { fixHMR } from 'fix-hmr';
import React from 'react';
import { useMintBasic } from 'contexts/mint-basic';
import { BasicSteps, BasicStepsEnum } from './BasicSteps';
import { Swap } from './Swap';
import { Mint } from './Mint';

export interface MintBasicProps {
  className?: string;
  clusterInfo: ClusterInfo;
}

function MintBasicBase({ className, clusterInfo }: MintBasicProps) {
  const { step, resetAndBackToSwap } = useMintBasic();

  return (
    <div className={className}>
      <BasicSteps step={step} />
      {step === BasicStepsEnum.SWAP ? (
        <Swap clusterInfo={clusterInfo} />
      ) : (
        <Mint
          clusterInfo={clusterInfo}
          resetAndBackToSwap={resetAndBackToSwap}
        />
      )}
    </div>
  );
}

export const MintBasic = fixHMR(MintBasicBase);
