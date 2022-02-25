import { useCW20TokenInfoQuery } from '@libs/app-provider';
import {
  useGovStateQuery,
  useNebBalance,
  useNebulaApp,
} from '@nebula-js/app-provider';
import { useMemo } from 'react';
import { NEB, Rate, u } from '@nebula-js/types';
import big, { Big } from 'big.js';

export function useTotalNebStaked() {
  const { contractAddress } = useNebulaApp();

  const govNebBalance = useNebBalance(contractAddress.gov);

  const { data: { govState } = {} } = useGovStateQuery();

  const { data: { tokenInfo } = {} } = useCW20TokenInfoQuery<NEB>(
    contractAddress.cw20.NEB,
    true,
  );

  return useMemo(() => {
    if (!govNebBalance || !govState || !tokenInfo) {
      return {
        totalStaked: big(0) as u<NEB<Big>>,
        stakingRatio: big(0) as Rate<Big>,
      };
    }

    const _totalStaked = big(govNebBalance).minus(govState.total_deposit) as u<
      NEB<Big>
    >;

    const _stakingRatio = _totalStaked.div(tokenInfo.total_supply) as Rate<Big>;

    return {
      totalStaked: _totalStaked,
      stakingRatio: _stakingRatio,
    };
  }, [govNebBalance, govState, tokenInfo]);
}
