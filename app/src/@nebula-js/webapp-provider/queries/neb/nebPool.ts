import { NEB } from '@nebula-js/types';
import { TerraswapPool } from '@libs/webapp-fns';
import { UseQueryResult } from 'react-query';
import { useNebulaWebapp } from '../../contexts/webapp';
import { useTerraswapPoolQuery } from '@libs/webapp-provider';

export function useNEBPoolQuery(): UseQueryResult<
  TerraswapPool<NEB> | undefined
> {
  const {
    contractAddress: { terraswap },
  } = useNebulaWebapp();

  return useTerraswapPoolQuery<NEB>(terraswap.nebUstPair);
}
