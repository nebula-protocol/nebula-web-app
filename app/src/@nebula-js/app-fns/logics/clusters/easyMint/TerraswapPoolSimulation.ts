import { TerraswapPoolInfo, terraswapPoolQuery } from '@libs/app-fns';
import { QueryClient } from '@libs/query-client';
import { HumanAddr, terraswap, Token, u } from '@nebula-js/types';
import big, { Big } from 'big.js';

export class TerraswapPoolSimulation {
  public pool!: terraswap.pair.PoolResponse<Token, Token>;
  public poolInfo!: TerraswapPoolInfo<Token>;
  //public asset0!: terraswap.Asset<Token>;
  //public asset1!: terraswap.Asset<Token>;

  constructor(
    private pairContract: HumanAddr,
    private comissionRate: number = 0.03,
    private queryClient: QueryClient,
  ) {}

  reset = async () => {
    await terraswapPoolQuery(this.pairContract, this.queryClient).then(
      ({ terraswapPool, terraswapPoolInfo }) => {
        this.pool = terraswapPool;
        this.poolInfo = terraswapPoolInfo;
        //this.asset0 = {...this.pool.assets[0]};
        //this.asset1 = {...this.pool.assets[1]};
      },
    );
  };

  simulateSwap = (
    offerAsset: terraswap.Asset<Token>,
  ): terraswap.pair.SimulationResponse<Token> => {
    const offerAmount = big(offerAsset.amount);

    let offerPoolAmt: u<Token<Big>>;
    let askPoolAmt: u<Token<Big>>;

    if ('token' in offerAsset.info) {
      offerPoolAmt = big(this.poolInfo.ustPoolSize) as u<Token<Big>>;
      askPoolAmt = big(this.poolInfo.tokenPoolSize) as u<Token<Big>>;
    } else {
      offerPoolAmt = big(this.poolInfo.tokenPoolSize) as u<Token<Big>>;
      askPoolAmt = big(this.poolInfo.ustPoolSize) as u<Token<Big>>;
    }

    const cp = big(offerPoolAmt).mul(askPoolAmt);
    const returnAmt = askPoolAmt.minus(cp.div(offerPoolAmt.plus(offerAmount)));
    const spreadAmt = big(
      big(offerAmount.mul(askPoolAmt)).div(offerPoolAmt),
    ).minus(returnAmt);
    const comissionAmt = returnAmt.mul(this.comissionRate);

    return {
      return_amount: returnAmt.minus(comissionAmt).toFixed() as u<Token>,
      spread_amount: spreadAmt.toFixed() as u<Token>,
      commission_amount: comissionAmt.toFixed() as u<Token>,
    };
  };

  executeSwap = (offerAsset: terraswap.Asset<Token>) => {
    const { commission_amount, return_amount, spread_amount } =
      this.simulateSwap(offerAsset);

    const assetIndex0 =
      JSON.stringify(offerAsset.info) === JSON.stringify(this.pool.assets[0])
        ? 0
        : 1;
    const assetIndex1 = assetIndex0 === 0 ? 1 : 0;

    this.pool.assets[assetIndex0].amount = big(
      this.pool.assets[assetIndex0].amount,
    )
      .plus(offerAsset.amount)
      .toFixed() as u<Token>;
    this.pool.assets[assetIndex1].amount = big(
      this.pool.assets[assetIndex1].amount,
    )
      .minus(return_amount)
      .toFixed() as u<Token>;

    return {
      return_amount,
      commission_amount,
      spread_amount,
    };
  };
}
