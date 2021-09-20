import { gov } from '@nebula-js/types';

export function computeGovTotalStaked(govState: gov.StateResponse) {
  return govState.total_share;
}
