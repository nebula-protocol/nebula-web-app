import { ClusterInfo } from '@nebula-js/webapp-fns';
import { fixHMR } from 'fix-hmr';
import styled from 'styled-components';
import React from 'react';

export interface MintBasicProps {
  className?: string;
  clusterInfo: ClusterInfo;
}

function MintBasicBase({ className }: MintBasicProps) {
  return <div className={className}>MintBasic</div>;
}

export const StyledMintBasic = styled(MintBasicBase)`
  // TODO
`;

export const MintBasic = fixHMR(StyledMintBasic);
