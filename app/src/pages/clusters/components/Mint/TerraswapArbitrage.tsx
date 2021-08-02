import { formatUToken, microfy } from '@nebula-js/notation';
import { CT, terraswap, Token, u } from '@nebula-js/types';
import { ClusterInfo } from '@nebula-js/webapp-fns';
import {
  useClusterArbMintTx,
  useClusterMintTerraswapArbitrageForm,
} from '@nebula-js/webapp-provider';
import { FeeBox } from 'components/boxes/FeeBox';
import { useTxBroadcast } from 'contexts/tx-broadcast';
import React, { useCallback } from 'react';
import { TokenForm } from './TokenForm';

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
    (amounts: Token[]) => {
      const stream = postTx?.({
        amounts: amounts.map(
          (amount) =>
            (amount.length > 0 ? microfy(amount).toFixed() : '0') as u<Token>,
        ),
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
    <TokenForm
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

        {/*<li>*/}
        {/*  <span>Tx Fee</span>*/}
        {/*  <span>{'txFee' in states ? formatUToken(states.txFee) : 0} UST</span>*/}
        {/*</li>*/}
      </FeeBox>
    </TokenForm>
  );
}
