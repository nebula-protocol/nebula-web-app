import { NEB } from '@nebula-js/types';
import { TerraswapPool } from '@libs/app-fns';
import { UseQueryResult } from 'react-query';
import { useNebulaWebapp } from '../../contexts/webapp';
import { useTerraswapPoolQuery } from '@libs/app-provider';

export function useNEBPoolQuery(): UseQueryResult<
  TerraswapPool<NEB> | undefined
> {
  const {
    contractAddress: { terraswap },
  } = useNebulaWebapp();

  return useTerraswapPoolQuery<NEB>(terraswap.nebUstPair);
}
