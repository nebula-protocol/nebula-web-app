import React, { ReactNode } from 'react';
import { useWallet } from '@terra-money/use-wallet';
import { GlobalStyle } from '@nebula-js/ui';
import { TerraUnsupportedNetwork } from 'components/modal/TerraUnsupportedNetwork';

interface TerraNetworkGuardProps {
  children: ReactNode;
}

export const TerraNetworkGuard = (props: TerraNetworkGuardProps) => {
  const { children } = props;

  const { network } = useWallet();

  if (network.chainID !== 'columbus-5') {
    return (
      <>
        <GlobalStyle />/
        <TerraUnsupportedNetwork />
      </>
    );
  }

  return <>{children}</>;
};
