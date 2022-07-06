import { ClusterInfo } from '@nebula-js/app-fns';
import { fixHMR } from 'fix-hmr';
import React from 'react';
import { useTwoSteps } from 'contexts/two-steps';
import { MultiBuy } from '../MultiBuy';
import { Mint } from './Mint';
import { TwoSteps, TwoStepsEnum } from '../../TwoSteps';
import { GuideInfo } from '@nebula-js/ui';

export interface MintBasicProps {
  className?: string;
  clusterInfo: ClusterInfo;
}

function MintBasicBase({ className, clusterInfo }: MintBasicProps) {
  const { step, resetAndBackToStep1 } = useTwoSteps();

  return (
    <div className={className}>
      <GuideInfo link="https://docs.neb.money/guide/clusters.html#mint-basic">
        <span>
          Enables minting of new cluster tokens starting with only Luna,
          involving two main steps
          <span id="extra">
            <br />
            <br />
            <span className="indent-text">
              1. The Luna is used to buy the cluster’s inventory assets at
              pro-rata amounts to the cluster’s inventory
            </span>
            <br />
            <br />
            <span className="indent-text">
              2. The bought assets are then used to mint cluster tokens, which
              are then returned to the user
            </span>
          </span>
        </span>
      </GuideInfo>
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
