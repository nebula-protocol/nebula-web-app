import { HumanAddr, terraswap, Token, u, UST } from '@nebula-js/types';
import { defaultMantleFetch, MantleFetch } from '@terra-dev/mantle';
import big, { Big, BigSource } from 'big.js';
import {
  TerraswapPoolInfo,
  terraswapPoolQuery,
} from '../../../queries/terraswap/pool';

export class TerraswapPoolSimulation {
  public pool!: terraswap.pair.PoolResponse<Token, Token>;
  public poolInfo!: TerraswapPoolInfo<Token>;

  constructor(
    private pairContract: HumanAddr,
    private comissionRate: number = 0.03,
    private mantleEndpoint: string,
    private mantleFetch: MantleFetch = defaultMantleFetch,
    private requestInit?: RequestInit,
  ) {}

  reset = async () => {
    await terraswapPoolQuery(
      this.pairContract,
      this.mantleEndpoint,
      this.mantleFetch,
      this.requestInit,
    ).then(({ terraswapPool, terraswapPoolInfo }) => {
      this.pool = terraswapPool;
      this.poolInfo = terraswapPoolInfo;
    });
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
}
