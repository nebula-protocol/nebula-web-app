import { CW20Addr, NEB, Rate, u, UST } from '@nebula-js/types';
import { StakingPoolInfoList, TerraswapPool } from '@nebula-js/webapp-fns';
import big, { Big } from 'big.js';

export type StakingView = Array<{
  index: number;
  id: CW20Addr;
  symbol: string;
  name: string;
  nameLowerCase: string;
  apr: Rate;
  totalStaked: u<UST<Big>>;
}>;

export function toStakingView(
  nebPool: TerraswapPool<NEB> | undefined,
  poolInfoList: StakingPoolInfoList,
): StakingView {
  return nebPool
    ? poolInfoList.map(
        (
          {
            poolInfo,
            terraswapPool,
            terraswapPoolInfo,
            tokenInfo,
            tokenAddr,
            terraswapPair,
          },
          i,
        ) => {
          const liquidityValue = big(
            big(nebPool.terraswapPoolInfo.tokenPrice).mul(
              terraswapPoolInfo.tokenPoolSize,
            ),
          ).plus(terraswapPoolInfo.ustPoolSize) as u<UST<Big>>;

          const totalStaked = liquidityValue.mul(
            big(poolInfo.total_bond_amount).div(
              +terraswapPool.total_share === 0 ? 1 : terraswapPool.total_share,
            ),
          ) as u<UST<Big>>;

          return {
            index: i,
            id: tokenAddr,
            symbol: tokenInfo.symbol,
            name: `${tokenInfo.symbol}-UST LP`,
            nameLowerCase: `${tokenInfo.symbol}-UST LP`.toLowerCase(),
            apr: '1.2312' as Rate,
            totalStaked,
          };
        },
      )
    : [];
}
