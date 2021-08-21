import {
  HumanAddr,
  NativeDenom,
  terraswap,
  Token,
  u,
  UST,
} from '@nebula-js/types';
import { defaultMantleFetch, MantleFetch } from '@packages/mantle';
import big, { Big, BigSource } from 'big.js';
import { terraswapPairQuery } from '../../../queries/terraswap/pair';
import { ClusterSimulatorWithPenalty } from './ClusterSimulatorWithPenalty';
import { TerraswapPoolSimulation } from './TerraswapPoolSimulation';

export class EasyMintOptimizer {
  private readonly clusterSimulator!: ClusterSimulatorWithPenalty;
  private terraswapSimulators!: TerraswapPoolSimulation[];
  private pairContracts!: HumanAddr[];

  private initialized: boolean = false;
  private inInitialize: boolean = false;
  private initializers: Set<() => void> = new Set();

  constructor(
    private clusterAddr: HumanAddr,
    private terraswapFactoryAddr: HumanAddr,
    private mantleEndpoint: string,
    private mantleFetch: MantleFetch = defaultMantleFetch,
    private requestInit?: RequestInit,
  ) {
    this.clusterSimulator = new ClusterSimulatorWithPenalty(
      clusterAddr,
      mantleEndpoint,
      mantleFetch,
      requestInit,
    );
  }

  // reset_initial_state
  resetInitialState = async () => {
    if (this.initialized) {
      return;
    }

    if (this.inInitialize) {
      return new Promise<void>((resolve) => {
        this.initializers.add(resolve);
      });
    }

    this.inInitialize = true;

    await this.clusterSimulator.resetInitialState();

    this.pairContracts = await Promise.all(
      this.clusterSimulator.clusterState.target.map(({ info }, i) => {
        return terraswapPairQuery(
          this.terraswapFactoryAddr,
          [
            info,
            {
              native_token: {
                denom: 'uusd' as NativeDenom,
              },
            },
          ],
          this.mantleEndpoint,
          this.mantleFetch,
          this.requestInit,
        );
      }),
    ).then((pairs) => {
      return pairs.map(({ terraswapPair }) => terraswapPair.contract_addr);
    });

    this.terraswapSimulators = this.pairContracts.map((p) => {
      return new TerraswapPoolSimulation(
        p,
        0.03,
        this.mantleEndpoint,
        this.mantleFetch,
        this.requestInit,
      );
    });

    await Promise.all(this.terraswapSimulators.map((ts) => ts.reset()));

    this.initialized = true;

    for (const initializer of this.initializers) {
      initializer();
    }
  };

  findOptimalAllocation = (ust: u<UST<BigSource>>) => {
    const uusdAmount = big(ust);
    const tsSims = this.terraswapSimulators;
    const clusterSim = this.clusterSimulator;
    const orderUusd = Math.floor(Math.log10(uusdAmount.toNumber())) - 6;
    const numChunks = Math.max(Math.pow(10, orderUusd), 100);
    const uusdPerChunk = uusdAmount.div(numChunks) as u<UST<Big>>;

    const optimalAssetAllocation = this.clusterSimulator.clusterState.inv.map(
      () => big(0),
    );
    const uusdPerAsset = this.clusterSimulator.clusterState.inv.map(() =>
      big(0),
    );
    let expectedClusterTokens = big(0);

    let i: number = -1;
    while (++i < numChunks) {
      let maxAssetIndex = -1;
      let maxClusterAmt = big(0);
      let bestAssetAmt = big(0);

      let j: number = -1;
      const jmax: number = clusterSim.targetAssets.length;
      while (++j < jmax) {
        //const asset = clusterSim.targetAssets[j];
        const tsSim = tsSims[j];

        const offerAsset: terraswap.Asset<UST> = {
          info: {
            native_token: {
              denom: 'uusd' as NativeDenom,
            },
          },
          amount: uusdPerChunk.toFixed() as u<UST>,
        };

        const { return_amount } = tsSim.simulateSwap(offerAsset);
        const assetAmt = big(return_amount);

        const addAmts = this.clusterSimulator.targetAssets.map(
          //eslint-disable-next-line no-loop-func
          (_, index) => (index === j ? big(assetAmt) : big(0)) as u<Token<Big>>,
        );

        const clusterTokenAmt = clusterSim.simulateMint(addAmts);

        if (clusterTokenAmt.gt(maxClusterAmt)) {
          maxClusterAmt = clusterTokenAmt;
          maxAssetIndex = j;
          bestAssetAmt = assetAmt;
        }
      }

      optimalAssetAllocation[maxAssetIndex] =
        optimalAssetAllocation[maxAssetIndex].plus(bestAssetAmt);
      uusdPerAsset[maxAssetIndex] =
        uusdPerAsset[maxAssetIndex].plus(uusdPerChunk);

      expectedClusterTokens = expectedClusterTokens.plus(maxClusterAmt);

      const offerAsset: terraswap.Asset<UST> = {
        amount: uusdPerChunk.toFixed() as u<UST>,
        info: {
          native_token: {
            denom: 'uusd' as NativeDenom,
          },
        },
      };

      tsSims[maxAssetIndex].executeSwap(offerAsset);

      const addAmts = this.clusterSimulator.targetAssets.map(
        (_, index) =>
          (index === maxAssetIndex ? big(bestAssetAmt) : big(0)) as u<
            Token<Big>
          >,
      );

      clusterSim.executeMint(addAmts);

      return {
        optimalAssetAllocation,
        uusdPerAsset,
        expectedClusterTokens,
      };
    }
  };
}
