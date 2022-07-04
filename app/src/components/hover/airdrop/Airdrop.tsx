import { useGasPrice, useUstBalance } from '@libs/app-provider';
import { Airdrop as AirdropData, validateTxFee } from '@nebula-js/app-fns';
import { useConnectedWallet } from '@terra-money/use-wallet';
import { useTxBroadcast } from 'contexts/tx-broadcast';
import React, { useState, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import { AirdropContent } from './AirdropContent';
import {
  useNebulaApp,
  useAirdropCheckQuery,
  useAirdropClaimTx,
} from '@nebula-js/app-provider';

export interface AirdropProps {
  className?: string;
  isMobile: boolean;
}

export function Airdrop({ className, isMobile }: AirdropProps) {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const { constants } = useNebulaApp();

  const connectedWallet = useConnectedWallet();

  const { data: airdrop } = useAirdropCheckQuery();

  const { broadcast } = useTxBroadcast();

  const postTx = useAirdropClaimTx();

  const userUstBalance = useUstBalance(connectedWallet?.walletAddress);

  // ---------------------------------------------
  // states
  // ---------------------------------------------
  const [airdropClosed, setAirdropClosed] = useState(false);

  const display = !airdropClosed && airdrop;

  // ---------------------------------------------
  // logics
  // ---------------------------------------------
  const airdropFee = useGasPrice(constants.airdropGas, 'uusd');

  const invalidTxFee = useMemo(
    () => connectedWallet && validateTxFee(userUstBalance, airdropFee),
    [airdropFee, connectedWallet, userUstBalance],
  );

  // ---------------------------------------------
  // callbacks
  // ---------------------------------------------
  const proceed = useCallback(
    (_airdrop: AirdropData) => {
      if (!connectedWallet) return;

      const stream = postTx?.({
        airdrop: _airdrop,
      });

      if (stream) {
        broadcast(stream);
      }
    },
    [broadcast, postTx, connectedWallet],
  );

  return display ? (
    <Container
      className={className}
      data-layout={isMobile ? 'mobile' : 'modal'}
    >
      <AirdropContent
        onClose={() => setAirdropClosed(true)}
        isMobileLayout={isMobile}
        claim={() => proceed(airdrop)}
        amount={airdrop.amount}
        disabled={
          !!invalidTxFee ||
          !connectedWallet ||
          !connectedWallet.availablePost ||
          !postTx
        }
      />
      {invalidTxFee && <p id="error">{invalidTxFee}</p>}
    </Container>
  ) : null;
}

const Container = styled.div`
  min-width: 260px;
  padding: 32px 24px;

  box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.15);
  background-color: var(--color-gray4);
  border-radius: 8px;

  &[data-layout='mobile'] {
    box-shadow: 0;
    border-radius: 0;
    height: auto;
    padding: 0;
  }

  button {
    cursor: pointer;
  }

  #error {
    margin-top: 1em;
    text-align: center;
    color: var(--color-red);
  }
`;
