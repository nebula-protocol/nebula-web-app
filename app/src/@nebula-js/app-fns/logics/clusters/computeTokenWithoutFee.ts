import { Rate, CT, u } from '@nebula-js/types';
import big from 'big.js';

function computeWithoutFeeBase<T extends CT>(
  tokenAmount: T,
  protocolFee: Rate,
): big {
  return big(tokenAmount).div(big(1).plus(protocolFee));
}

export function computeTokenWithoutFee(tokenAmount: CT, protocolFee: Rate): CT {
  return computeWithoutFeeBase<CT>(tokenAmount, protocolFee).toFixed() as CT;
}

export function computeUTokenWithoutFee(
  uTokenAmount: u<CT>,
  protocolFee: Rate,
): u<CT> {
  return computeWithoutFeeBase<CT>(uTokenAmount, protocolFee).toFixed(
    0,
  ) as u<CT>;
}
