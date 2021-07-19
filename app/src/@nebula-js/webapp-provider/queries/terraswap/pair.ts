import { HumanAddr } from '@anchor-protocol/types';
import { terraswap } from '@nebula-js/types';
import { TerraswapPair, terraswapPairQuery } from '@nebula-js/webapp-fns';
import { createQueryFn } from '@terra-dev/react-query-utils';
import { useBrowserInactive } from '@terra-dev/use-browser-inactive';
import { MantleFetch, useTerraWebapp } from '@terra-money/webapp-provider';
import { useQuery, UseQueryResult } from 'react-query';
import { useNebulaWebapp } from '../../contexts/webapp';
import { NEBULA_QUERY_KEYS } from '../../env';

const queryFn = createQueryFn(
  (
    mantleEndpoint: string,
    mantleFetch: MantleFetch,
    terraswapFactoryAddr: HumanAddr,
    assetInfos: [terraswap.AssetInfo, terraswap.AssetInfo],
  ) => {
    return terraswapPairQuery({
      mantleEndpoint,
      mantleFetch,
      wasmQuery: {
        terraswapPair: {
          contractAddress: terraswapFactoryAddr,
          query: {
            pair: {
              asset_infos: assetInfos,
            },
          },
        },
      },
    });
  },
);

export function useTerraswapPairQuery(
  assetInfos: [terraswap.AssetInfo, terraswap.AssetInfo],
): UseQueryResult<TerraswapPair | undefined> {
  const { mantleFetch, mantleEndpoint, queryErrorReporter } = useTerraWebapp();

  const { contractAddress } = useNebulaWebapp();

  const { browserInactive } = useBrowserInactive();

  const result = useQuery(
    [
      NEBULA_QUERY_KEYS.TERRASWAP_PAIR,
      mantleEndpoint,
      mantleFetch,
      contractAddress.terraswap.factory,
      assetInfos,
    ],
    queryFn,
    {
      refetchInterval: browserInactive && 1000 * 60 * 5,
      enabled: !browserInactive,
      keepPreviousData: true,
      onError: queryErrorReporter,
    },
  );

  return result;
}
