import { FormLabel, NativeSelect } from '@nebula-js/ui';
import { useClustersInfoListQuery } from '@nebula-js/webapp-provider';
import React, { ChangeEvent, useEffect, useState } from 'react';
import { PollCreateBase } from './PollCreateBase';

export default function PollBlacklistCluster() {
  const { data: clustersList = [] } = useClustersInfoListQuery();

  const [targetClusterSymbol, setTargetClusterSymbol] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (clustersList?.length > 0) {
      setTargetClusterSymbol((prev) => {
        return !prev ? clustersList[0].clusterTokenInfo.symbol : prev;
      });
    }
  }, [clustersList]);

  return (
    <PollCreateBase
      title="Blacklist Cluster"
      description="Delist an existing cluster from Nebula Protocol"
      onCreateMsg={() => null}
      submitButtonStatus
    >
      {typeof targetClusterSymbol === 'string' && (
        <FormLabel label="Choose a Cluster" className="form-label">
          <NativeSelect
            fullWidth
            value={targetClusterSymbol}
            onChange={({ target }: ChangeEvent<HTMLSelectElement>) =>
              setTargetClusterSymbol(target.value)
            }
          >
            {clustersList.map(({ clusterTokenInfo }) => (
              <option
                key={clusterTokenInfo.symbol}
                value={clusterTokenInfo.symbol}
              >
                {clusterTokenInfo.symbol} - {clusterTokenInfo.name}
              </option>
            ))}
          </NativeSelect>
        </FormLabel>
      )}
    </PollCreateBase>
  );
}
