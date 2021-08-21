import { cluster, CT, u } from '@nebula-js/types';
import {
  clusterRedeemBasicForm,
  NebulaTax,
  NebulaTokenBalances,
} from '@nebula-js/webapp-fns';
import { useForm } from '@packages/use-form';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useBank, useTerraWebapp } from '@packages/webapp-provider';
import { useNebulaWebapp } from '../../contexts/webapp';
import { useCW20BalanceQuery } from '../../queries/cw20/balance';

export interface ClusterRedeemBasicFormParams {
  clusterState: cluster.ClusterStateResponse;
}

export function useClusterRedeemBasicForm({
  clusterState,
}: ClusterRedeemBasicFormParams) {
  const connectedWallet = useConnectedWallet();

  const { mantleFetch, mantleEndpoint, lastSyncedHeight } = useTerraWebapp();

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
      gasPriceEndpoint: constants.gasPriceEndpoint,
    },
    () => {
      return {
        tokenAmount: '' as CT,
      };
    },
  );
}
