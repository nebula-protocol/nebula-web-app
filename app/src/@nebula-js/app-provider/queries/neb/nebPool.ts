import { TerraswapPool } from '@libs/app-fns';
import { useApp, useTerraswapPoolQuery } from '@libs/app-provider';
import { NebulaContants, NebulaContractAddress } from '@nebula-js/app-fns';
import { NEB } from '@nebula-js/types';
import { UseQueryResult } from 'react-query';

export function useNEBPoolQuery(): UseQueryResult<
  TerraswapPool<NEB> | undefined
> {
  const { contractAddress } = useApp<NebulaContractAddress, NebulaContants>();

  return useTerraswapPoolQuery<NEB>(contractAddress.terraswap.nebUstPair);
}
