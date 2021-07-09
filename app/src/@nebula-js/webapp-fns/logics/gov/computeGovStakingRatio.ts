import { cw20, gov, Rate, uNEB } from '@nebula-js/types';
import big, { Big } from 'big.js';

export function computeGovStakingRatio(
  govState: gov.StateResponse,
  nebTokenInfo: cw20.TokenInfoResponse<uNEB>,
) {
  return big(govState.total_share).div(nebTokenInfo.total_supply) as Rate<Big>;
}
