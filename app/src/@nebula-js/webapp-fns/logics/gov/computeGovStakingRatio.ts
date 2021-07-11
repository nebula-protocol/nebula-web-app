import { cw20, gov, Rate, u, NEB } from '@nebula-js/types';
import big, { Big } from 'big.js';

export function computeGovStakingRatio(
  govState: gov.StateResponse,
  nebTokenInfo: cw20.TokenInfoResponse<u<NEB>>,
) {
  return big(govState.total_share).div(nebTokenInfo.total_supply) as Rate<Big>;
}
