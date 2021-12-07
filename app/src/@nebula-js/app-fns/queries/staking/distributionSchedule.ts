import {
  QueryClient,
  wasmFetch,
  WasmQuery,
  WasmQueryData,
} from '@libs/query-client';
import { cluster_factory, HumanAddr } from '@nebula-js/types';

interface DistributionScheduleWasmQuery {
  distributionSchedule: WasmQuery<
    cluster_factory.Config,
    cluster_factory.ConfigResponse
  >;
  distributionInfo: WasmQuery<
    cluster_factory.DistributionInfo,
    cluster_factory.DistributionInfoResponse
  >;
}

interface Distribution {
  startTime: Date;
  distributePerSec: number;
}

export type DistributionSchedule =
  WasmQueryData<DistributionScheduleWasmQuery> & {
    distribution: Distribution[];
    endTime: Date;
  };

export async function distributionScheduleQuery(
  clusterFactoryAddr: HumanAddr,
  queryClient: QueryClient,
): Promise<DistributionSchedule> {
  const { distributionSchedule, distributionInfo } =
    await wasmFetch<DistributionScheduleWasmQuery>({
      ...queryClient,
      id: `distribution-schedule`,
      wasmQuery: {
        distributionSchedule: {
          contractAddress: clusterFactoryAddr,
          query: {
            config: {},
          },
        },
        distributionInfo: {
          contractAddress: clusterFactoryAddr,
          query: {
            distribution_info: {},
          },
        },
      },
    });

  const distribution = distributionSchedule.distribution_schedule.map(
    (schedule: [number, number, string]) => {
      const startTime = new Date(
        (distributionSchedule.genesis_time + schedule[0]) * 1000,
      );
      const distributePerSec =
        Number(schedule[2]) / (schedule[1] - schedule[0]);
      return {
        startTime,
        distributePerSec,
      };
    },
  );

  return {
    distributionSchedule,
    distributionInfo,
    distribution,
    endTime: new Date(
      (distributionSchedule.distribution_schedule[
        distributionSchedule.distribution_schedule.length - 1
      ][1] +
        distributionSchedule.genesis_time) *
        1000,
    ),
  };
}
