import { HumanAddr, terraswap, Token } from '@libs/types';
import {
  BytesValid,
  useValidateStringBytes,
} from '@libs/use-string-bytes-length';
import { ClusterParameter, clusterParameterQuery } from '@nebula-js/app-fns';
import { useNebulaApp } from '@nebula-js/app-provider';
import { cluster, gov } from '@nebula-js/types';
import { FormLabel, TextInput } from '@nebula-js/ui';
import { AccAddress } from '@terra-money/terra.js';
import big from 'big.js';
import React, {
  ChangeEvent,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useClusterSelection } from '../hooks/useClusterSelection';
import { ClusterAssetsForm } from './ClusterAssetsForm';
import { PollCreateBase } from './PollCreateBase';

export default function PollClusterParameterChange() {
  const { clusters, selectCluster, selectedIndex } = useClusterSelection();

  const { contractAddress, queryClient } = useNebulaApp();

  // ---------------------------------------------
  // states
  // ---------------------------------------------
  const [originParameters, setOriginParameters] =
    useState<ClusterParameter | null>(null);
  const [clusterName, setClusterName] = useState<string>('');
  const [clusterDescription, setClusterDescription] = useState<string>('');
  const [priceOracleAddress, setPriceOracleAddress] = useState<string>('');
  const [targetOracleAddress, setTargetOracleAddress] = useState<string>('');
  const [penaltyAddress, setPenaltyAddress] = useState<string>('');
  const [assets, setAssets] = useState<terraswap.Asset<Token>[]>(() => []);

  // ---------------------------------------------
  // logics
  // ---------------------------------------------
  const { validAssets } = useMemo(() => {
    let valid = true;

    for (const { amount } of assets) {
      if (amount.length === 0 || big(amount).lte(0)) {
        valid = false;
      }
    }

    return {
      validAssets: valid,
    };
  }, [assets]);

  const invalidClusterName = useValidateStringBytes(clusterName, 4, 64);

  const invalidClusterDescription = useValidateStringBytes(
    clusterDescription,
    4,
    1024,
  );

  const invalidPriceOracleAddress = useMemo(() => {
    return !AccAddress.validate(priceOracleAddress)
      ? 'Invalid terra address'
      : undefined;
  }, [priceOracleAddress]);

  const invalidTargetOracleAddress = useMemo(() => {
    return !AccAddress.validate(targetOracleAddress)
      ? 'Invalid terra address'
      : undefined;
  }, [targetOracleAddress]);

  const invalidPenaltyAddress = useMemo(() => {
    return !AccAddress.validate(penaltyAddress)
      ? 'Invalid terra address'
      : undefined;
  }, [penaltyAddress]);

  // ---------------------------------------------
  // effects
  // ---------------------------------------------
  useEffect(() => {
    if (clusters.length > 0) {
      const { clusterState } = clusters[selectedIndex];

      clusterParameterQuery(
        clusterState.cluster_contract_address,
        queryClient,
      ).then((param) => {
        setOriginParameters(param);
        setClusterName(param.clusterConfig.config.name);
        setClusterDescription(param.clusterConfig.config.description);
        setPriceOracleAddress(param.clusterConfig.config.pricing_oracle);
        setTargetOracleAddress(param.clusterConfig.config.target_oracle);
        setPenaltyAddress(param.clusterConfig.config.penalty);
        setAssets(param.clusterTarget.target);
      });
    }
  }, [clusters, queryClient, selectedIndex]);

  // ---------------------------------------------
  // callbacks
  // ---------------------------------------------
  const onSelectCluster = useCallback(
    (clusterToken: string) => {
      const nextCluster = clusters.find(
        ({ clusterState }) => clusterState.cluster_token === clusterToken,
      );

      if (!nextCluster) {
        throw new Error(`Can't find cluster "${clusterToken}"`);
      }

      selectCluster(nextCluster);
    },
    [clusters, selectCluster],
  );

  const createMsg = useCallback(() => {
    if (!originParameters) {
      throw new Error(`Can't find origin cluster parameters!`);
    }

    const clusterUpdateConfig: cluster.UpdateConfig['update_config'] = {};

    if (originParameters.clusterConfig.config.name !== clusterName) {
      clusterUpdateConfig.name = clusterName;
    }

    if (
      originParameters.clusterConfig.config.description !== clusterDescription
    ) {
      clusterUpdateConfig.description = clusterDescription;
    }

    if (
      originParameters.clusterConfig.config.pricing_oracle !==
      priceOracleAddress
    ) {
      clusterUpdateConfig.pricing_oracle = priceOracleAddress as HumanAddr;
    }

    if (
      originParameters.clusterConfig.config.target_oracle !==
      targetOracleAddress
    ) {
      clusterUpdateConfig.target_oracle = targetOracleAddress as HumanAddr;
    }

    if (originParameters.clusterConfig.config.penalty !== penaltyAddress) {
      clusterUpdateConfig.penalty = penaltyAddress as HumanAddr;
    }

    // TODO update target

    const executeMsg: gov.ExecuteMsg = {
      contract: contractAddress.gov,
      msg: Buffer.from(JSON.stringify(clusterUpdateConfig)).toString('base64'),
    };

    return executeMsg;
  }, [
    clusterDescription,
    clusterName,
    contractAddress.gov,
    originParameters,
    penaltyAddress,
    priceOracleAddress,
    targetOracleAddress,
  ]);

  // ---------------------------------------------
  // presentation
  // ---------------------------------------------
  if (clusters.length === 0) {
    return null;
  }

  return (
    <PollCreateBase
      title="Cluster Parameter Change"
      description="Modify parameters of an existing cluster"
      onCreateMsg={createMsg}
      submitButtonStatus={
        !!originParameters &&
        (originParameters.clusterConfig.config.name !== clusterName ||
          originParameters.clusterConfig.config.description !==
            clusterDescription ||
          originParameters.clusterConfig.config.pricing_oracle !==
            priceOracleAddress ||
          originParameters.clusterConfig.config.target_oracle !==
            targetOracleAddress ||
          originParameters.clusterConfig.config.penalty !== penaltyAddress ||
          originParameters.clusterTarget.target !== assets) &&
        clusterName.length > 0 &&
        clusterDescription.length > 0 &&
        priceOracleAddress.length > 0 &&
        targetOracleAddress.length > 0 &&
        penaltyAddress.length > 0 &&
        validAssets &&
        !invalidClusterName &&
        !invalidClusterDescription &&
        !invalidPriceOracleAddress &&
        !invalidTargetOracleAddress &&
        !invalidPenaltyAddress
          ? true
          : 'disabled'
      }
    >
      <FormLabel label="Cluster" className="form-label">
        <select
          value={clusters[selectedIndex].clusterState.cluster_token}
          onChange={({ target }: ChangeEvent<{ value: string }>) =>
            onSelectCluster(target.value)
          }
        >
          {clusters.map(({ clusterState, clusterConfig }, i) => (
            <option
              key={clusterState.cluster_token}
              value={clusterState.cluster_token}
            >
              {clusterConfig.config.name}
            </option>
          ))}
        </select>
      </FormLabel>

      <FormLabel label="Cluster Name" className="form-label">
        <TextInput
          fullWidth
          value={clusterName}
          onChange={({ target }) => setClusterName(target.value)}
          error={!!invalidClusterName}
          helperText={
            invalidClusterName === BytesValid.LESS
              ? 'Cluster name must be at least 4 bytes.'
              : invalidClusterName === BytesValid.MUCH
              ? 'Cluster name cannot be longer than 64 bytes.'
              : undefined
          }
        />
      </FormLabel>

      <FormLabel label="Cluster Description" className="form-label">
        <TextInput
          fullWidth
          multiline
          minRows={4}
          maxRows={10}
          value={clusterDescription}
          onChange={({ target }) => setClusterDescription(target.value)}
          error={!!invalidClusterDescription}
          helperText={
            invalidClusterDescription === BytesValid.LESS
              ? 'Clusterster description must be at least 4 bytes.'
              : invalidClusterDescription === BytesValid.MUCH
              ? 'Clusterster description cannot be longer than 1024 bytes.'
              : undefined
          }
        />
      </FormLabel>

      <FormLabel label="Price Oracle Address" className="form-label">
        <TextInput
          placeholder="terra1..."
          fullWidth
          value={priceOracleAddress}
          onChange={({ target }) => setPriceOracleAddress(target.value)}
          error={!!invalidPriceOracleAddress}
          helperText={invalidPriceOracleAddress}
        />
      </FormLabel>

      <FormLabel label="Target Oracle Address" className="form-label">
        <TextInput
          placeholder="terra1..."
          fullWidth
          value={targetOracleAddress}
          onChange={({ target }) => setTargetOracleAddress(target.value)}
          error={!!invalidTargetOracleAddress}
          helperText={invalidTargetOracleAddress}
        />
      </FormLabel>

      <FormLabel label="Penalty Address" className="form-label">
        <TextInput
          placeholder="terra1..."
          fullWidth
          value={penaltyAddress}
          onChange={({ target }) => setPenaltyAddress(target.value)}
          error={!!invalidPenaltyAddress}
          helperText={invalidPenaltyAddress}
        />
      </FormLabel>

      <FormLabel label="Tokens" className="form-label">
        <ClusterAssetsForm assets={assets} onAssetsChange={setAssets} />
      </FormLabel>
    </PollCreateBase>
  );
}
