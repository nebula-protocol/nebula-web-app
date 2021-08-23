import { gov, NEB, u } from '@nebula-js/types';
import { max } from '@libs/big-math';
import big, { Big } from 'big.js';

export function computeUnstakableNebBalance(
  govStaker: gov.StakerResponse | undefined,
): u<NEB> {
  const lockedNebBalance =
    govStaker && govStaker.locked_balance.length > 0
      ? (max(
          0,
          ...govStaker.locked_balance.map(([, { balance }]) => balance),
        ) as u<NEB<Big>>)
      : ('0' as u<NEB>);

  return govStaker
    ? (big(govStaker.balance).minus(lockedNebBalance).toFixed() as u<NEB>)
    : ('0' as u<NEB>);
}
