import { Rate, CT, u } from '@nebula-js/types';
import big from 'big.js';

function computeWithFeeBase<T extends CT>(
  tokenAmount: T,
  protocolFee: Rate,
): big {
  return big(tokenAmount).mul(big(1).plus(protocolFee));
}

export function computeTokenWithFee(tokenAmount: CT, protocolFee: Rate): CT {
  return computeWithFeeBase<CT>(tokenAmount, protocolFee).toFixed() as CT;
}

export function computeUTokenWithFee(
  uTokenAmount: u<CT>,
  protocolFee: Rate,
): u<CT> {
  return computeWithFeeBase<CT>(uTokenAmount, protocolFee).toFixed(0) as u<CT>;
}
