import { ClusterInfo, ClustersInfoList } from '@nebula-js/app-fns';
import { useClustersInfoListQuery } from '@nebula-js/app-provider';
import { useCallback, useState } from 'react';

interface ClusterSelection {
  clusters: ClustersInfoList;
  selectedIndex: number;
  selectCluster: (next: ClusterInfo) => void;
}

export function useClusterSelection(): ClusterSelection {
  const { data: clusters = [] } = useClustersInfoListQuery();

  const [selectedIndex, setSelectedIndex] = useState(() => 0);

  const selectCluster = useCallback(
    (next: ClusterInfo) => {
      const nextIndex = clusters.findIndex(
        (target) =>
          target === next ||
          target.clusterState.cluster_token === next.clusterState.cluster_token,
      );
      if (nextIndex > -1) {
        setSelectedIndex(nextIndex);
      }
    },
    [clusters],
  );

  return {
    clusters,
    selectedIndex,
    selectCluster,
  };
}
