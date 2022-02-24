import { TerraswapPoolInfo } from '@libs/app-fns';
import { staking, Token, UST, u } from '@nebula-js/types';
import big from 'big.js';
import { divWithDefault } from '@libs/big-math';

// stakedLiquidityValue = ((tokenPrice * tokenPoolSize) + ustPoolSize) * (total_bond_amount / total_share)
export function computeStakedValue(
  terraswapPoolInfo: TerraswapPoolInfo<Token>,
  poolInfo: staking.PoolInfoResponse,
): u<UST> {
  const liquidityValue = big(terraswapPoolInfo.tokenPrice)
    .mul(terraswapPoolInfo.tokenPoolSize)
    .plus(terraswapPoolInfo.ustPoolSize);

  return liquidityValue
    .mul(
      divWithDefault(poolInfo.total_bond_amount, terraswapPoolInfo.lpShare, 0),
    )
    .toString() as u<UST>;
}
