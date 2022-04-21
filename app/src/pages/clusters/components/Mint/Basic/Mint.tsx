import { formatUToken } from '@libs/formatter';
import { u, UST, Token } from '@nebula-js/types';
import { breakpoints, Button, useScreenSizeValue } from '@nebula-js/ui';
import { ClusterInfo } from '@nebula-js/app-fns';
import {
  useClusterMintBasicForm,
  useClusterMintTx,
} from '@nebula-js/app-provider';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { FeeBox } from 'components/boxes/FeeBox';
import { useTxBroadcast } from 'contexts/tx-broadcast';
import { fixHMR } from 'fix-hmr';
import React, { useCallback } from 'react';
import styled from 'styled-components';
import { TokenTable } from '../TokenTable';
import { WarningMessageBox } from 'components/boxes/WarningMessageBox';

export interface MintBasicProps {
  className?: string;
  clusterInfo: ClusterInfo;
  resetAndBackToSwap: () => void;
}

function MintBasicBase({
  className,
  clusterInfo: { clusterState, assetTokenInfos, clusterTokenInfo },
  resetAndBackToSwap,
}: MintBasicProps) {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const connectedWallet = useConnectedWallet();

  const { broadcast } = useTxBroadcast();

  const postTx = useClusterMintTx(
    clusterState.cluster_contract_address,
    clusterState.target,
    clusterTokenInfo.symbol,
  );

  // ---------------------------------------------
  // states
  // ---------------------------------------------
  const [, states] = useClusterMintBasicForm({
    clusterState,
  });

  // ---------------------------------------------
  // callbacks
  // ---------------------------------------------
  const proceed = useCallback(
    (amounts: u<Token>[], txFee: u<UST>) => {
      const stream = postTx?.({
        amounts,
        txFee,
        onTxSucceed: () => {
          resetAndBackToSwap();
        },
      });

      if (stream) {
        console.log('Basic Mint', stream);
        broadcast(stream);
      }
    },
    [broadcast, postTx, resetAndBackToSwap],
  );

  // ---------------------------------------------
  // presentation
  // ---------------------------------------------
  const buttonSize = useScreenSizeValue<'normal' | 'medium'>({
    mobile: 'medium',
    tablet: 'normal',
    pc: 'normal',
    monitor: 'normal',
  });

  return (
    <div className={className}>
      {'providedAmounts' in states && Array.isArray(states.providedAmounts) && (
        <TokenTable
          name="Provided Amount"
          amounts={states.providedAmounts}
          // TODO: use pool prices?
          prices={clusterState.prices}
          assetTokenInfos={assetTokenInfos}
        />
      )}

      <FeeBox className="feebox">
        {'mintedAmount' in states && states.mintedAmount && (
          <li>
            <span>Minted {clusterTokenInfo.symbol}</span>
            <span>
              {formatUToken(states.mintedAmount)} {clusterTokenInfo.symbol}
            </span>
          </li>
        )}

        {states.txFee !== null && (
          <li>
            <span>Tx Fee</span>
            <span>{formatUToken(states.txFee)} UST</span>
          </li>
        )}
      </FeeBox>

      {states.invalidMintQuery ? (
        <WarningMessageBox level="critical" className="warning">
          {states.invalidMintQuery}
        </WarningMessageBox>
      ) : null}

      <Button
        className="submit"
        color="paleblue"
        size={buttonSize}
        disabled={
          !connectedWallet ||
          !connectedWallet.availablePost ||
          !states ||
          !(
            'providedAmounts' in states && Array.isArray(states.providedAmounts)
          ) ||
          !states.txFee
        }
        onClick={() =>
          'providedAmounts' in states &&
          Array.isArray(states.providedAmounts) &&
          states.txFee &&
          proceed(states.providedAmounts, states.txFee)
        }
      >
        Mint
      </Button>
    </div>
  );
}

export const StyledMintBasic = styled(MintBasicBase)`
  .token-input {
    margin-bottom: 2.28571429em;
  }

  .loading-container {
    display: flex;
    justify-content: center;
    width: 100%;
  }

  .feebox {
    margin-top: 2.8em;
  }

  .warning {
    margin-top: 2.14285714em;
  }

  .submit {
    display: block;
    width: 100%;
    max-width: 360px;
    margin: 2.8em auto 0 auto;
  }

  @media (max-width: ${breakpoints.mobile.max}px) {
    .feebox {
      font-size: 0.9em;
      margin-top: 2.2em;
    }

    .submit {
      margin-top: 2.2em;
    }
  }
`;

export const Mint = fixHMR(StyledMintBasic);
