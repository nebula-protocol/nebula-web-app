import { useNebulaApp } from '@nebula-js/app-provider';
import { useTerraswapPoolQuery } from '@libs/app-provider';
import { NEB, UST } from '@nebula-js/types';

export function useNebPrice() {
  const { contractAddress } = useNebulaApp();

  const { data: { terraswapPoolInfo } = {} } = useTerraswapPoolQuery<NEB>(
    contractAddress.terraswap.nebUstPair,
  );

  return terraswapPoolInfo
    ? terraswapPoolInfo.tokenPrice
    : ('0' as UST<string>);
}
