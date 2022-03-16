import { ClusterInfo } from '@nebula-js/app-fns';
import React, { useState } from 'react';
import styled from 'styled-components';
import { fixHMR } from 'fix-hmr';
import { BasicSwitch } from '@nebula-js/ui/switches';
import { MintArbAdvanced } from './ArbAdvanced';
import { MintArbBasic } from './ArbBasic';

export interface MintArbitrageProps {
  className?: string;
  clusterInfo: ClusterInfo;
}

function MintArbitrageBase({ className, clusterInfo }: MintArbitrageProps) {
  const [advancedMode, setAdvancedMode] = useState(false);

  return (
    <div className={className}>
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
