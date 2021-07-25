import { cluster, terraswap, UST } from '@nebula-js/types';
import {
  clusterRedeemTerraswapArbitrageForm,
  NebulaTax,
  NebulaTokenBalances,
} from '@nebula-js/webapp-fns';
import { useForm } from '@terra-dev/use-form';
import { useBank, useTerraWebapp } from '@terra-money/webapp-provider';
import { useNebulaWebapp } from '../../contexts/webapp';

export interface ClusterRedeemTerraswapArbitrageFormParams {
  clusterState: cluster.ClusterStateResponse;
  terraswapPair: terraswap.factory.PairResponse;
}

export function useClusterRedeemTerraswapArbitrageForm({
  clusterState,
  terraswapPair,
}: ClusterRedeemTerraswapArbitrageFormParams) {
  const { mantleFetch, mantleEndpoint, lastSyncedHeight } = useTerraWebapp();

  const {
    constants: { fixedGas },
  } = useNebulaWebapp();

  const { tax, tokenBalances } = useBank<NebulaTokenBalances, NebulaTax>();

  return useForm(
    clusterRedeemTerraswapArbitrageForm,
    {
      mantleEndpoint,
      mantleFetch,
      lastSyncedHeight,
      ustBalance: tokenBalances.uUST,
      terraswapPair,
      tax,
      fixedGas,
      clusterState,
    },
    () => {
      return {
        ustAmount: '' as UST,
      };
    },
  );
}
