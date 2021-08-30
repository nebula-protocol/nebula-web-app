import { useForm } from '@libs/use-form';
import {
  useBank,
  useCW20BalanceQuery,
  useTerraWebapp,
} from '@libs/webapp-provider';
import { cluster, CT, u } from '@nebula-js/types';
import {
  clusterRedeemBasicForm,
  NebulaTax,
  NebulaTokenBalances,
} from '@nebula-js/webapp-fns';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useNebulaWebapp } from '../../contexts/webapp';

export interface ClusterRedeemBasicFormParams {
  clusterState: cluster.ClusterStateResponse;
}

export function useClusterRedeemBasicForm({
  clusterState,
}: ClusterRedeemBasicFormParams) {
  const connectedWallet = useConnectedWallet();

  const { mantleFetch, mantleEndpoint, lastSyncedHeight, gasPrice } =
    useTerraWebapp();

  const { constants } = useNebulaWebapp();

  const { tax } = useBank<NebulaTokenBalances, NebulaTax>();

  const { data: { tokenBalance } = {} } = useCW20BalanceQuery<CT>(
    clusterState.cluster_token,
    connectedWallet?.terraAddress,
  );

  return useForm(
    clusterRedeemBasicForm,
    {
      mantleEndpoint,
      mantleFetch,
      lastSyncedHeight,
      tokenBalance: tokenBalance?.balance ?? ('0' as u<CT>),
      tax,
      clusterState,
      fixedGas: constants.fixedGas,
      clusterFee: constants.clusterFee,
      gasPrice,
    },
    () => {
      return {
        tokenAmount: '' as CT,
      };
    },
  );
}
