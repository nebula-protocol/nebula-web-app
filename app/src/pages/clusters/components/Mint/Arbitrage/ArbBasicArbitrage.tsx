import { formatUToken } from '@libs/formatter';
import { u, UST, Token, Rate } from '@nebula-js/types';
import {
  Disclosure,
  FormLabel,
  breakpoints,
  Button,
  useScreenSizeValue,
} from '@nebula-js/ui';
import { ClusterInfo } from '@nebula-js/app-fns';
import {
  useClusterMintArbBasicForm,
  useClusterArbMintTx,
} from '@nebula-js/app-provider';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { FeeBox } from 'components/boxes/FeeBox';
import { useTxBroadcast } from 'contexts/tx-broadcast';
import { fixHMR } from 'fix-hmr';
import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import { TokenTable } from '../TokenTable';
import { SlippageToleranceInput } from 'components/form/SlippageToleranceInput';

export interface MintArbBasicArbitrageProps {
  className?: string;
  clusterInfo: ClusterInfo;
  resetAndBackToSwap: () => void;
}

function MintArbBasicArbitrageBase({
  className,
  clusterInfo: {
    clusterState,
    assetTokenInfos,
    clusterTokenInfo,
    terraswapPair,
  },
  resetAndBackToSwap,
}: MintArbBasicArbitrageProps) {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const connectedWallet = useConnectedWallet();

  const { broadcast } = useTxBroadcast();

  const postTx = useClusterArbMintTx(
    clusterState.cluster_contract_address,
    terraswapPair.contract_addr,
    clusterState.target,
  );

  // ---------------------------------------------
  // states
  // ---------------------------------------------
  const [openMoreOptions, setOpenMoreOptions] = useState<boolean>(false);

  const [updateInput, states] = useClusterMintArbBasicForm({
    clusterState,
    terraswapPair,
  });

  // ---------------------------------------------
  // callbacks
  // ---------------------------------------------
  const proceed = useCallback(
    (amounts: u<Token>[], txFee: u<UST>, minUust: u<UST>) => {
      const stream = postTx?.({
        amounts,
        txFee,
        minUust,
        onTxSucceed: () => {
          resetAndBackToSwap();
        },
      });

      if (stream) {
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
          assetTokenInfos={assetTokenInfos}
        />
      )}

      <Disclosure
        className="more-options"
        title="More Options"
        open={openMoreOptions}
        onChange={setOpenMoreOptions}
      >
        <FormLabel label="Max Spread">
          <SlippageToleranceInput
            initialCustomValue={'0.1' as Rate}
            value={states.maxSpread}
            onChange={(nextMaxSpread) =>
              updateInput({ maxSpread: nextMaxSpread })
            }
          />
        </FormLabel>
      </Disclosure>

      <FeeBox className="feebox">
        {clusterTokenInfo &&
          'returnedAmount' in states &&
          states.returnedAmount && (
            <li>
              <span>Minimum Returned UST</span>
              <span>{formatUToken(states.returnedAmount)} UST</span>
            </li>
          )}

        {'pnl' in states && states.pnl && (
          <li>
            <span>PNL</span>
            <span>{formatUToken(states.pnl)} UST</span>
          </li>
        )}

        {states.txFee !== null && (
          <li>
            <span>Tx Fee</span>
            <span>{states.txFee ? formatUToken(states.txFee) : 0} UST</span>
          </li>
        )}
      </FeeBox>

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
          'returnedAmount' in states &&
          states.returnedAmount &&
          proceed(states.providedAmounts, states.txFee, states.returnedAmount)
        }
      >
        Arb
      </Button>
    </div>
  );
}

export const StyledMintArbBasicArbitrage = styled(MintArbBasicArbitrageBase)`
  .more-options {
    margin-top: 2.14285714em;
    margin-bottom: 2.14285714em;
  }

  .feebox {
    margin-top: 2.8em;
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

export const MintArbBasicArbitrage = fixHMR(StyledMintArbBasicArbitrage);
