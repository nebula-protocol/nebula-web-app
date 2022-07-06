import { useFixedFee, useTerraBalancesQuery } from '@libs/app-provider';
import { useForm } from '@libs/use-form';
import {
  clusterMintArbAdvancedForm,
  ClusterMintArbAdvancedFormInput,
} from '@nebula-js/app-fns';
import { cluster, terraswap, CT, Token, Luna, Rate } from '@nebula-js/types';
import { useMemo } from 'react';
import { useNebulaApp } from '../../hooks/useNebulaApp';
import { useProtocolFee } from '@nebula-js/app-provider';
import { useTwoSteps } from 'contexts/two-steps';

export interface ClusterMintArbAdvancedFormParams {
  clusterState: cluster.ClusterStateResponse;
  terraswapPool: terraswap.pair.PoolResponse<CT, Luna>;
  terraswapPair: terraswap.factory.PairResponse;
}

export function useClusterMintArbAdvancedForm({
  clusterState,
  terraswapPool,
  terraswapPair,
}: ClusterMintArbAdvancedFormParams) {
  const { queryClient, lastSyncedHeight, gasPrice, constants } = useNebulaApp();

  const assetInfos = useMemo(() => {
    return clusterState.target.map(({ info }) => info);
  }, [clusterState.target]);

  const fixedFee = useFixedFee();

  const { data: balances } = useTerraBalancesQuery(assetInfos);

  const { tokenAmounts } = useTwoSteps();

  const protocolFee = useProtocolFee();

  return useForm(
    clusterMintArbAdvancedForm,
    {
      queryClient,
      clusterState,
      terraswapPool,
      lastSyncedHeight,
      terraswapPair,
      balances,
      providedAmounts: tokenAmounts,
      protocolFee,
      fixedFee,
      clusterFee: constants.nebula.clusterFee,
      gasPrice,
    },
    () => {
      return {
        addedAssets: new Set<terraswap.Asset<Token>>(),
        amounts: assetInfos.map(() => '' as Token),
        maxSpread: '0.01' as Rate,
      } as ClusterMintArbAdvancedFormInput;
    },
  );
}
