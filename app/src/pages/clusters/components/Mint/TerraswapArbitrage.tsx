import { formatUToken, microfy } from '@libs/formatter';
import { CT, terraswap, Token, u, UST } from '@nebula-js/types';
import { ClusterInfo } from '@nebula-js/app-fns';
import {
  useClusterArbMintTx,
  useClusterMintTerraswapArbitrageForm,
} from '@nebula-js/app-provider';
import { FeeBox } from 'components/boxes/FeeBox';
import { useTxBroadcast } from 'contexts/tx-broadcast';
import React, { useCallback } from 'react';
import { TokenFormMint } from './TokenFormMint';

export interface MintTerraswapArbitrageProps {
  clusterInfo: ClusterInfo;
}

export function MintTerraswapArbitrage({
  clusterInfo,
}: MintTerraswapArbitrageProps) {
  const [updateInput, states] = useClusterMintTerraswapArbitrageForm({
    clusterState: clusterInfo.clusterState,
    terraswapPair: clusterInfo.terraswapPair,
  });

  const { broadcast } = useTxBroadcast();

  const postTx = useClusterArbMintTx(
    clusterInfo.clusterState.cluster_contract_address,
    clusterInfo.terraswapPair.contract_addr,
    clusterInfo.clusterState.target,
  );

  const initForm = useCallback(() => {
    updateInput({
      amounts: clusterInfo.clusterState.target.map(() => '' as CT),
      addedAssets: new Set<terraswap.Asset<Token>>(),
    });
  }, [clusterInfo.clusterState.target, updateInput]);

  const proceed = useCallback(
    (amounts: Token[], txFee: u<UST>) => {
      const stream = postTx?.({
        amounts: amounts.map(
          (amount) =>
            (amount.length > 0 ? microfy(amount).toFixed() : '0') as u<Token>,
        ),
        txFee,
        onTxSucceed: initForm,
      });

      if (stream) {
        console.log('Advanced.tsx..()', stream);
        broadcast(stream);
      }
    },
    [broadcast, initForm, postTx],
  );

  return (
    <TokenFormMint
      clusterInfo={clusterInfo}
      updateInput={updateInput}
      states={states}
      onProceed={proceed}
    >
      <FeeBox className="feebox">
        {clusterInfo.clusterTokenInfo &&
          'returnedAmount' in states &&
          states.returnedAmount && (
            <li>
              <span>Returned UST</span>
              <span>{formatUToken(states.returnedAmount)} UST</span>
            </li>
          )}

        {states.txFee !== null && (
          <li>
            <span>Tx Fee</span>
            <span>{states.txFee ? formatUToken(states.txFee) : 0} UST</span>
          </li>
        )}
      </FeeBox>
    </TokenFormMint>
  );
}
