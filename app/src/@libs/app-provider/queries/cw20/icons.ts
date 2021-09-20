import { CW20Icons, cw20IconsQuery } from '@libs/app-fns';
import { useApp } from '@libs/app-provider/contexts/app';
import { createQueryFn } from '@libs/react-query-utils';
import { useQuery, UseQueryResult } from 'react-query';
import { TERRA_QUERY_KEY } from '../../env';

const queryFn = createQueryFn(cw20IconsQuery);

export function useCW20IconsQuery(): UseQueryResult<CW20Icons> {
  const { queryErrorReporter } = useApp();

  const result = useQuery([TERRA_QUERY_KEY.CW20_ICONS], queryFn, {
    keepPreviousData: true,
    onError: queryErrorReporter,
  });

  return result;
}
