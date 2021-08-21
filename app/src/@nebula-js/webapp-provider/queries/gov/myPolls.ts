import { GovMyPolls, govMyPollsQuery } from '@nebula-js/webapp-fns';
import { createQueryFn } from '@packages/react-query-utils';
import { useBrowserInactive } from '@packages/use-browser-inactive';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useTerraWebapp } from '@packages/webapp-provider';
import { useQuery, UseQueryResult } from 'react-query';
import { useNebulaWebapp } from '../../contexts/webapp';
import { NEBULA_QUERY_KEYS } from '../../env';

const queryFn = createQueryFn(govMyPollsQuery);

export function useGovMyPollsQuery(): UseQueryResult<GovMyPolls | undefined> {
  const connectedWallet = useConnectedWallet();

  const { mantleFetch, mantleEndpoint, queryErrorReporter, lastSyncedHeight } =
    useTerraWebapp();

  const { contractAddress } = useNebulaWebapp();

  const { browserInactive } = useBrowserInactive();

  const result = useQuery(
    [
      NEBULA_QUERY_KEYS.GOV_MY_POLLS,
      connectedWallet?.walletAddress,
      contractAddress.gov,
      contractAddress.cw20.NEB,
      lastSyncedHeight,
      mantleEndpoint,
      mantleFetch,
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
