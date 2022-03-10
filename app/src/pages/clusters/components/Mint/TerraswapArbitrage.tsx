import { formatUToken, microfy } from '@libs/formatter';
import { CT, terraswap, Token, u, UST, Rate } from '@nebula-js/types';
import { ClusterInfo } from '@nebula-js/app-fns';
import {
  useClusterArbMintTx,
  useClusterMintTerraswapArbitrageForm,
} from '@nebula-js/app-provider';
import {
  Disclosure,
  FormLabel,
  breakpoints,
  Button,
  useScreenSizeValue,
} from '@nebula-js/ui';
import { FeeBox } from 'components/boxes/FeeBox';
import { useTxBroadcast } from 'contexts/tx-broadcast';
import React, { useCallback, useState } from 'react';
import { TokenFormMint } from './TokenFormMint';
import { SlippageToleranceInput } from 'components/form/SlippageToleranceInput';
import styled from 'styled-components';
import { fixHMR } from 'fix-hmr';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { WarningMessageBox } from 'components/boxes/WarningMessageBox';

export interface MintTerraswapArbitrageProps {
  className?: string;
  clusterInfo: ClusterInfo;
}

function MintTerraswapArbitrageBase({
  className,
  clusterInfo,
}: MintTerraswapArbitrageProps) {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const connectedWallet = useConnectedWallet();

  const { broadcast } = useTxBroadcast();

  const postTx = useClusterArbMintTx(
    clusterInfo.clusterState.cluster_contract_address,
    clusterInfo.terraswapPair.contract_addr,
    clusterInfo.clusterState.target,
  );

  // ---------------------------------------------
  // states
  // ---------------------------------------------

  const [openMoreOptions, setOpenMoreOptions] = useState<boolean>(false);

  const [updateInput, states] = useClusterMintTerraswapArbitrageForm({
    clusterState: clusterInfo.clusterState,
    terraswapPool: clusterInfo.terraswapPool,
    terraswapPair: clusterInfo.terraswapPair,
  });

  // ---------------------------------------------
  // callbacks
  // ---------------------------------------------

  const initForm = useCallback(() => {
    updateInput({
      amounts: clusterInfo.clusterState.target.map(() => '' as CT),
      addedAssets: new Set<terraswap.Asset<Token>>(),
    });
  }, [clusterInfo.clusterState.target, updateInput]);

  const proceed = useCallback(
    (amounts: Token[], txFee: u<UST>, minUust: u<UST>) => {
      const stream = postTx?.({
        amounts: amounts.map(
          (amount) =>
            (amount.length > 0 ? microfy(amount).toFixed() : '0') as u<Token>,
        ),
        txFee,
        minUust,
        onTxSucceed: initForm,
      });

      if (stream) {
        broadcast(stream);
      }
    },
    [broadcast, initForm, postTx],
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
      <TokenFormMint
        clusterInfo={clusterInfo}
        updateInput={updateInput}
        states={states}
      >
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
          {clusterInfo.clusterTokenInfo &&
            'returnedAmount' in states &&
            states.returnedAmount && (
              <li>
                <span>Minimum Returned UST</span>
                <span>{formatUToken(states.returnedAmount)} UST</span>
              </li>
            )}

          {clusterInfo.clusterTokenInfo && 'pnl' in states && states.pnl && (
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
            !states.txFee ||
            !('returnedAmount' in states && states.returnedAmount) ||
            states.amounts.every((amount) => amount.length === 0)
          }
          onClick={() =>
            states.txFee &&
            'returnedAmount' in states &&
            states.returnedAmount &&
            proceed(states.amounts, states.txFee, states.returnedAmount)
          }
        >
          Mint
        </Button>
      </TokenFormMint>
    </div>
  );
}

export const StyledMintTerraswapArbitrage = styled(MintTerraswapArbitrageBase)`
  .more-options {
    margin-top: 2.14285714em;
    margin-bottom: 2.14285714em;
  }

  .warning {
    margin-top: 2.14285714em;
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

export const MintTerraswapArbitrage = fixHMR(StyledMintTerraswapArbitrage);
