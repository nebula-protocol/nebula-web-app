import { useNebulaApp } from '@nebula-js/app-provider';
import { cluster_factory, gov } from '@nebula-js/types';
import { FormLabel, NativeSelect } from '@nebula-js/ui';
import React, { ChangeEvent, useCallback } from 'react';
import { useClusterSelection } from '../hooks/useClusterSelection';
import { PollCreateBase } from './PollCreateBase';

export default function PollBlacklistCluster() {
  const { clusters, selectCluster, selectedIndex } = useClusterSelection();

  const { contractAddress } = useNebulaApp();

  // ---------------------------------------------
  // callbacks
  // ---------------------------------------------
  const onSelectCluster = useCallback(
    (clusterToken: string) => {
      const nextCluster = clusters.find(
        ({ clusterState }) => clusterState.cluster_token === clusterToken,
      );

      if (!nextCluster) {
        throw new Error(`Can't find cluster "${clusterToken}"`);
      }

      selectCluster(nextCluster);
    },
    [clusters, selectCluster],
  );

  const createMsg = useCallback(() => {
    if (clusters.length === 0) {
      throw new Error(`Can't find target cluster!`);
    }

    const decommissionCluster: cluster_factory.DecommissionCluster = {
      decommission_cluster: {
        cluster_contract:
          clusters[selectedIndex].clusterState.cluster_contract_address,
        cluster_token: clusters[selectedIndex].clusterState.cluster_token,
      },
    };

    const executeMsg: gov.ExecuteMsg = {
      contract: contractAddress.clusterFactory,
      msg: Buffer.from(JSON.stringify(decommissionCluster)).toString('base64'),
    };

    return executeMsg;
  }, [clusters, contractAddress.clusterFactory, selectedIndex]);

  // ---------------------------------------------
  // presentation
  // ---------------------------------------------
  if (clusters.length === 0) {
    return null;
  }

  return (
    <PollCreateBase
      title="Blacklist Cluster"
      description="Delist an existing cluster from Nebula Protocol"
      onCreateMsg={createMsg}
      submitButtonStatus={true}
    >
      <FormLabel label="Choose a Cluster" className="form-label">
        <NativeSelect
          fullWidth
          value={clusters[selectedIndex].clusterState.cluster_token}
          onChange={({ target }: ChangeEvent<HTMLSelectElement>) =>
            onSelectCluster(target.value)
          }
        >
          {clusters.map(({ clusterTokenInfo, clusterState }) => (
            <option
              key={clusterState.cluster_token}
              value={clusterState.cluster_token}
            >
              {clusterTokenInfo.symbol} - {clusterTokenInfo.name}
            </option>
          ))}
        </NativeSelect>
      </FormLabel>
    </PollCreateBase>
  );
}
