import { NEB } from '@nebula-js/types';
import { TerraswapPool } from '@nebula-js/webapp-fns';
import { UseQueryResult } from 'react-query';
import { useNebulaWebapp } from '../../contexts/webapp';
import { useTerraswapPoolQuery } from '../terraswap/pool';

export function useNEBPoolQuery(): UseQueryResult<
  TerraswapPool<NEB> | undefined
> {
  const {
    contractAddress: { terraswap },
  } = useNebulaWebapp();

  return useTerraswapPoolQuery<NEB>(terraswap.nebUstPair);
}
