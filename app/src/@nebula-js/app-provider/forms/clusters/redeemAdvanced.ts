import {
  useCW20Balance,
  useFixedFee,
  useTerraBalancesQuery,
  useUstTax,
} from '@libs/app-provider';
import { useForm } from '@libs/use-form';
import { clusterRedeemAdvancedForm } from '@nebula-js/app-fns';
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

  const fixedFee = useFixedFee();

  const { taxRate, maxTax } = useUstTax();

  const { data: balances } = useTerraBalancesQuery(assetInfos);

  const uCT = useCW20Balance<CT>(
    clusterState.cluster_token,
    connectedWallet?.terraAddress,
  );

  return useForm(
    clusterRedeemAdvancedForm,
    {
      queryClient,
      clusterState,
      lastSyncedHeight,
      balances,
      tokenBalance: uCT,
      taxRate,
      maxTaxUUSD: maxTax,
      fixedFee,
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
