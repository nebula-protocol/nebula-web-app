import { formatUToken, microfy } from '@libs/formatter';
import { CT, terraswap, Token, u, UST } from '@nebula-js/types';
import { ClusterInfo } from '@nebula-js/app-fns';
import {
  useClusterMintAdvancedForm,
  useClusterMintTx,
} from '@nebula-js/app-provider';
import { FeeBox } from 'components/boxes/FeeBox';
import { useTxBroadcast } from 'contexts/tx-broadcast';
import { TokenForm } from 'pages/clusters/components/Mint/TokenForm';
import React, { useCallback } from 'react';

export interface MintAdvancedProps {
  clusterInfo: ClusterInfo;
}

export function MintAdvanced({ clusterInfo }: MintAdvancedProps) {
  const [updateInput, states] = useClusterMintAdvancedForm({
    clusterState: clusterInfo.clusterState,
  });

  const { broadcast } = useTxBroadcast();

  const postTx = useClusterMintTx(
    clusterInfo.clusterState.cluster_contract_address,
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
    <TokenForm
      clusterInfo={clusterInfo}
      updateInput={updateInput}
      states={states}
      onProceed={proceed}
    >
      <FeeBox className="feebox">
        {clusterInfo.clusterTokenInfo &&
          'mintedAmount' in states &&
          states.mintedAmount && (
            <li>
              <span>Minted {clusterInfo.clusterTokenInfo.symbol}</span>
              <span>
                {formatUToken(states.mintedAmount)}{' '}
                {clusterInfo.clusterTokenInfo.symbol}
              </span>
            </li>
          )}

        {states.txFee !== null && (
          <li>
            <span>Tx Fee</span>
            <span>{states.txFee ? formatUToken(states.txFee) : 0} UST</span>
          </li>
        )}
      </FeeBox>
    </TokenForm>
  );
}
