import { useApp } from '@libs/app-provider';
import { createQueryFn } from '@libs/react-query-utils';
import {
  GovStaker,
  govStakerQuery,
  NebulaContants,
  NebulaContractAddress,
} from '@nebula-js/app-fns';
import { HumanAddr } from '@nebula-js/types';
import { useQuery, UseQueryResult } from 'react-query';
import { NEBULA_QUERY_KEYS } from '../../env';

const queryFn = createQueryFn(govStakerQuery);

export function useGovStakerQuery(
  walletAddr: HumanAddr | undefined,
): UseQueryResult<GovStaker | undefined> {
  const { wasmClient, queryErrorReporter, contractAddress } = useApp<
    NebulaContractAddress,
    NebulaContants
  >();

  //const { contractAddress } = useNebulaWebapp();
  //
  //const { browserInactive } = useBrowserInactive();

  const result = useQuery(
    [NEBULA_QUERY_KEYS.GOV_STAKER, walletAddr, contractAddress.gov, wasmClient],
    queryFn,
    {
      refetchInterval: 1000 * 60 * 5,
      keepPreviousData: true,
      onError: queryErrorReporter,
    },
  );

  return result as UseQueryResult<GovStaker | undefined>;
}
