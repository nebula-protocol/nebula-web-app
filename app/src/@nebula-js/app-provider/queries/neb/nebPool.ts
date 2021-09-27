import { TerraswapPool } from '@libs/app-fns';
import { useTerraswapPoolQuery } from '@libs/app-provider';
import { NEB } from '@nebula-js/types';
import { UseQueryResult } from 'react-query';
import { useNebulaApp } from '../../hooks/useNebulaApp';

export function useNEBPoolQuery(): UseQueryResult<
  TerraswapPool<NEB> | undefined
> {
  const { contractAddress } = useNebulaApp();

  return useTerraswapPoolQuery<NEB>(contractAddress.terraswap.nebUstPair);
}
