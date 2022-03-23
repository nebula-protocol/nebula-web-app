import { ClusterInfo } from '@nebula-js/app-fns';
import React, { useState } from 'react';
import styled from 'styled-components';
import { fixHMR } from 'fix-hmr';
import { BasicSwitch } from '@nebula-js/ui/switches';
import { MintArbAdvanced } from './ArbAdvanced';
import { MintArbBasic } from './ArbBasic';
import { GuideInfo } from '@nebula-js/ui';

export interface MintArbitrageProps {
  className?: string;
  clusterInfo: ClusterInfo;
}

function MintArbitrageBase({ className, clusterInfo }: MintArbitrageProps) {
  const [advancedMode, setAdvancedMode] = useState(false);

  return (
    <div className={className}>
      <GuideInfo link="https://docs.neb.money/guide/clusters.html#arbitraging">
        <span>
          Enables profitable arbitraging when the cluster’s market price exceeds
          its intrinsic price
          <span id="extra">
            <br />
            <br />
            The mode:
            <br />
            <br />
            <span className="indent-text">
              1. Use either the user’s UST or, if the Advanced toggle is
              enabled, their inputted inventory assets, to mint cluster tokens
            </span>
            <br />
            <br />
            <span className="indent-text">
              2. Sell the cluster tokens on Astroport, returning UST to the user
            </span>
          </span>
        </span>
      </GuideInfo>
      <BasicSwitch
        title="Advanced Mode"
        checked={advancedMode}
        updateChecked={setAdvancedMode}
      />
      {!advancedMode && <MintArbBasic clusterInfo={clusterInfo} />}
      {advancedMode && <MintArbAdvanced clusterInfo={clusterInfo} />}
    </div>
  );
}

const StyledMintArbitrage = styled(MintArbitrageBase)``;

export const MintArbitrage = fixHMR(StyledMintArbitrage);
