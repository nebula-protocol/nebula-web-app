import { useApp } from '@libs/app-provider';
import { createQueryFn } from '@libs/react-query-utils';
import {
  GovPoll,
  govPollQuery,
  NebulaContants,
  NebulaContractAddress,
} from '@nebula-js/app-fns';
import { useQuery, UseQueryResult } from 'react-query';
import { NEBULA_QUERY_KEYS } from '../../env';

const queryFn = createQueryFn(govPollQuery);

export function useGovPollQuery(
  pollId: number | undefined,
): UseQueryResult<GovPoll | undefined> {
  const { wasmClient, queryErrorReporter, lastSyncedHeight, contractAddress } =
    useApp<NebulaContractAddress, NebulaContants>();

  //const { contractAddress } = useNebulaWebapp();
  //
  //const { browserInactive } = useBrowserInactive();

  const result = useQuery(
    [
      NEBULA_QUERY_KEYS.GOV_POLL,
      contractAddress.gov,
      pollId!,
      contractAddress.cw20.NEB,
      lastSyncedHeight,
      wasmClient,
    ],
    queryFn,
    {
      refetchInterval: 1000 * 60 * 5,
      keepPreviousData: true,
      onError: queryErrorReporter,
    },
  );

  return result;
}
