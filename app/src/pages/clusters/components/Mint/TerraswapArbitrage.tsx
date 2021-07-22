import { ClusterInfo } from '@nebula-js/webapp-fns';
import { fixHMR } from 'fix-hmr';
import styled from 'styled-components';
import React from 'react';

export interface MintTerraswapArbitrageProps {
  className?: string;
  clusterInfo: ClusterInfo;
}

function MintTerraswapArbitrageBase({
  className,
}: MintTerraswapArbitrageProps) {
  return <div className={className}>MintTerraswapArbitrage</div>;
}

export const StyledMintTerraswapArbitrage = styled(MintTerraswapArbitrageBase)`
  // TODO
`;

export const MintTerraswapArbitrage = fixHMR(StyledMintTerraswapArbitrage);
