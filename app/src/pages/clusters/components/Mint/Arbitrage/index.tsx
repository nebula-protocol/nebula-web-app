import { ClusterInfo } from '@nebula-js/app-fns';
import React, { useState } from 'react';
import styled from 'styled-components';
import { fixHMR } from 'fix-hmr';
import { AdvancedSwitch } from '@nebula-js/ui/switches/AdvancedSwitch';
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
      <AdvancedSwitch checked={advancedMode} updateChecked={setAdvancedMode} />
      {!advancedMode && <MintArbBasic clusterInfo={clusterInfo} />}
      {advancedMode && <MintArbAdvanced clusterInfo={clusterInfo} />}
    </div>
  );
}

const StyledMintArbitrage = styled(MintArbitrageBase)``;

export const MintArbitrage = fixHMR(StyledMintArbitrage);
