import { HumanAddr } from '@nebula-js/types';
import { GovStaker, govStakerQuery } from '@nebula-js/webapp-fns';
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
    walletAddr: HumanAddr | undefined,
    govAddr: HumanAddr,
  ) => {
    return walletAddr
      ? govStakerQuery({
          mantleEndpoint,
          mantleFetch,
          wasmQuery: {
            govStaker: {
              contractAddress: govAddr,
              query: {
                staker: {
                  address: walletAddr,
                },
              },
            },
          },
        })
      : Promise.resolve(undefined);
  },
);

export function useGovStakerQuery(
  walletAddr: HumanAddr | undefined,
): UseQueryResult<GovStaker | undefined> {
  const { mantleFetch, mantleEndpoint, queryErrorReporter } = useTerraWebapp();

  const { contractAddress } = useNebulaWebapp();

  const { browserInactive } = useBrowserInactive();

  const result = useQuery(
    [
      NEBULA_QUERY_KEYS.CW20_BALANCE,
      mantleEndpoint,
      mantleFetch,
      walletAddr,
      contractAddress.gov,
    ],
    queryFn,
    {
      refetchInterval: browserInactive && 1000 * 60 * 5,
      enabled: !browserInactive,
      keepPreviousData: true,
      onError: queryErrorReporter,
    },
  );

  return result as UseQueryResult<GovStaker | undefined>;
}
