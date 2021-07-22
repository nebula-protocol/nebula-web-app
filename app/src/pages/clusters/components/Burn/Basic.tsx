import { ClusterInfo } from '@nebula-js/webapp-fns';
import { fixHMR } from 'fix-hmr';
import styled from 'styled-components';
import React from 'react';

export interface BurnBasicProps {
  className?: string;
  clusterInfo: ClusterInfo;
}

function BurnBasicBase({ className }: BurnBasicProps) {
  return <div className={className}>BurnBasic</div>;
}

export const StyledBurnBasic = styled(BurnBasicBase)`
  // TODO
`;

export const BurnBasic = fixHMR(StyledBurnBasic);
