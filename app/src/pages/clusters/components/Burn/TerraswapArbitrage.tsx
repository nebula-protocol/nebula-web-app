import { ClusterInfo } from '@nebula-js/webapp-fns';
import { fixHMR } from 'fix-hmr';
import styled from 'styled-components';
import React from 'react';

export interface BurnTerraswapArbitrageProps {
  className?: string;
  clusterInfo: ClusterInfo;
}

function BurnTerraswapArbitrageBase({
  className,
}: BurnTerraswapArbitrageProps) {
  return <div className={className}>BurnTerraswapArbitrage</div>;
}

export const StyledBurnTerraswapArbitrage = styled(BurnTerraswapArbitrageBase)`
  // TODO
`;

export const BurnTerraswapArbitrage = fixHMR(StyledBurnTerraswapArbitrage);
