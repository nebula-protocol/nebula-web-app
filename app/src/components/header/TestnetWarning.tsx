import styled from 'styled-components';
import { useWallet } from '@terra-money/wallet-provider';
import React from 'react';

const TestnetWarningBase = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 40px;
  background-color: var(--color-blue01);
  color: var(--color-gray08);
  font-weight: 500;
  font-size: var(--font-size14-12);
`;

export function TestnetWarning() {
  const { network } = useWallet();

  return network.name.toLowerCase().indexOf('classic') !== 0 ? (
    <TestnetWarningBase>
      You are using Nebula Protocol on testnet network.
    </TestnetWarningBase>
  ) : null;
}
