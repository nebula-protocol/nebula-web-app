import {
  cluster_factory,
  CW20Addr,
  HumanAddr,
  NativeDenom,
} from '@nebula-js/types';
import { MantleParams, WasmQuery } from '@terra-dev/mantle';
import { ClusterInfo, clusterInfoQuery } from './info';
import { clustersListQuery } from './list';

export interface ClustersInfoListWasmQuery {
  clusterList: WasmQuery<
    cluster_factory.ClusterList,
    cluster_factory.ClusterListResponse
  >;
}

export type ClustersInfoList = ClusterInfo[];

export type ClustersInfoListQueryParams = Omit<
  MantleParams<ClustersInfoListWasmQuery>,
  'query' | 'variables'
> & {
  terraswapFactoryAddr: HumanAddr;
};

export async function clustersInfoListQuery({
  mantleEndpoint,
  wasmQuery,
  terraswapFactoryAddr,
  ...params
}: ClustersInfoListQueryParams): Promise<ClustersInfoList> {
  const { clusterList } = await clustersListQuery({
    mantleEndpoint,
    wasmQuery,
    ...params,
  });

  // TODO remove filter
  clusterList.contract_addrs = clusterList.contract_addrs.filter(
    (clusterAddr) =>
      clusterAddr !== 'terra1wyuvudl8eeley2npg4q4wsehzpw3uh3kk2a8am',
  );

  return Promise.all(
    clusterList.contract_addrs.map((clusterAddr) =>
      clusterInfoQuery({
        mantleEndpoint,
        wasmQuery: {
          clusterState: {
            contractAddress: clusterAddr,
            query: {
              cluster_state: {
                cluster_contract_address: clusterAddr,
              },
            },
          },
          clusterConfig: {
            contractAddress: clusterAddr,
            query: {
              config: {},
            },
          },
          terraswapPair: {
            contractAddress: terraswapFactoryAddr,
            query: {
              pair: {
                asset_infos: [
                  {
                    token: {
                      contract_addr: '' as CW20Addr,
                    },
                  },
                  {
                    native_token: {
                      denom: 'uusd' as NativeDenom,
                    },
                  },
                ],
              },
            },
          },
          terraswapPool: {
            contractAddress: '',
            query: {
              pool: {},
            },
          },
        },
        ...params,
      }),
    ),
  );
}
