import { useCW20Balance, useTerraBalancesQuery } from '@libs/app-provider';
import { useForm } from '@libs/use-form';
import { clusterRedeemAdvancedForm } from '@nebula-js/app-fns';
import { useProtocolFee } from '@nebula-js/app-provider';
import { cluster, terraswap, CT, Token } from '@nebula-js/types';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useMemo } from 'react';
import { useNebulaApp } from '../../hooks/useNebulaApp';

export interface ClusterRedeemAdvancedFormParams {
  clusterState: cluster.ClusterStateResponse;
}

export function useClusterRedeemAdvancedForm({
  clusterState,
}: ClusterRedeemAdvancedFormParams) {
  const connectedWallet = useConnectedWallet();

  const { queryClient, lastSyncedHeight, gasPrice, constants } = useNebulaApp();

  const assetInfos = useMemo(() => {
    return clusterState.target.map(({ info }) => info);
  }, [clusterState.target]);

  const { data: balances } = useTerraBalancesQuery(assetInfos);

  const uCT = useCW20Balance<CT>(
    clusterState.cluster_token,
    connectedWallet?.terraAddress,
  );

  const protocolFee = useProtocolFee();

  return useForm(
    clusterRedeemAdvancedForm,
    {
      queryClient,
      clusterState,
      lastSyncedHeight,
      balances,
      tokenBalance: uCT,
      protocolFee,
      clusterFee: constants.nebula.clusterFee,
      gasPrice,
    },
    () => {
      return {
        tokenAmount: '' as CT,
        addedAssets: new Set<terraswap.Asset<Token>>(),
        amounts: assetInfos.map(() => '' as Token),
      };
    },
  );
}
