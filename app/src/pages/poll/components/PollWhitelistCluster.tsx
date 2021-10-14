import { microfy } from '@libs/formatter';
import { HumanAddr, terraswap, Token, u } from '@libs/types';
import {
  BytesValid,
  useValidateStringBytes,
} from '@libs/use-string-bytes-length';
import { useNebulaApp } from '@nebula-js/app-provider';
import { cluster_factory, gov } from '@nebula-js/types';
import { FormLabel, TextInput } from '@nebula-js/ui';
import { AccAddress } from '@terra-money/terra.js';
import big from 'big.js';
import React, { useCallback, useMemo, useState } from 'react';
import { ClusterAssetsForm, FormAsset } from './ClusterAssetsForm';
import { PollCreateBase } from './PollCreateBase';

export default function PollWhitelistCluster() {
  const { contractAddress } = useNebulaApp();

  // ---------------------------------------------
  // states
  // ---------------------------------------------
  const [clusterSymbol, setClusterSymbol] = useState<string>('');
  const [clusterName, setClusterName] = useState<string>('');
  const [clusterDescription, setClusterDescription] = useState<string>('');
  const [priceOracleAddress, setPriceOracleAddress] = useState<string>('');
  const [targetOracleAddress, setTargetOracleAddress] = useState<string>('');
  const [penaltyAddress, setPenaltyAddress] = useState<string>('');
  const [assets, setAssets] = useState<FormAsset[]>(() => []);

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

  const invalidSymbol = useValidateStringBytes(clusterSymbol, 3, 64);

  const invalidClusterName = useValidateStringBytes(clusterName, 4, 64);

  const invalidClusterDescription = useValidateStringBytes(
    clusterDescription,
    4,
    1024,
  );

  const invalidPriceOracleAddress = useMemo(() => {
    if (priceOracleAddress.length === 0) {
      return undefined;
    }
    return !AccAddress.validate(priceOracleAddress)
      ? 'Invalid terra address'
      : undefined;
  }, [priceOracleAddress]);

  const invalidTargetOracleAddress = useMemo(() => {
    if (targetOracleAddress.length === 0) {
      return undefined;
    }
    return !AccAddress.validate(targetOracleAddress)
      ? 'Invalid terra address'
      : undefined;
  }, [targetOracleAddress]);

  const invalidPenaltyAddress = useMemo(() => {
    if (penaltyAddress.length === 0) {
      return undefined;
    }
    return !AccAddress.validate(penaltyAddress)
      ? 'Invalid terra address'
      : undefined;
  }, [penaltyAddress]);

  // ---------------------------------------------
  // callbacks
  // ---------------------------------------------
  const createMsg = useCallback(() => {
    const clusterFactoryCreateCluster: cluster_factory.CreateCluster = {
      create_cluster: {
        params: {
          name: clusterName,
          symbol: clusterSymbol,
          description: clusterDescription,
          penalty: penaltyAddress as HumanAddr,
          pricing_oracle: priceOracleAddress as HumanAddr,
          target_oracle: targetOracleAddress as HumanAddr,
          target: assets.map(({ info, amount }) => {
            return {
              info,
              amount: microfy(amount).toFixed() as u<Token>,
            } as terraswap.Asset<Token>;
          }),
        },
      },
    };

    const executeMsg: gov.ExecuteMsg = {
      contract: contractAddress.clusterFactory,
      msg: Buffer.from(JSON.stringify(clusterFactoryCreateCluster)).toString(
        'base64',
      ),
    };

    return executeMsg;
  }, [
    clusterName,
    clusterSymbol,
    clusterDescription,
    penaltyAddress,
    priceOracleAddress,
    targetOracleAddress,
    assets,
    contractAddress.clusterFactory,
  ]);

  // ---------------------------------------------
  // presentation
  // ---------------------------------------------
  return (
    <PollCreateBase
      title="Whitelist Cluster"
      description="Register a new cluster on Nebula Protocol"
      onCreateMsg={createMsg}
      submitButtonStatus={
        clusterSymbol.length > 0 &&
        clusterName.length > 0 &&
        clusterDescription.length > 0 &&
        priceOracleAddress.length > 0 &&
        targetOracleAddress.length > 0 &&
        penaltyAddress.length > 0 &&
        validAssets &&
        !invalidSymbol &&
        !invalidClusterName &&
        !invalidClusterDescription &&
        !invalidPriceOracleAddress &&
        !invalidTargetOracleAddress &&
        !invalidPenaltyAddress
          ? true
          : 'disabled'
      }
    >
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

      <FormLabel label="Symbol" className="form-label">
        <TextInput
          fullWidth
          value={clusterSymbol}
          onChange={({ target }) => setClusterSymbol(target.value)}
          error={!!invalidClusterName}
          helperText={
            invalidSymbol === BytesValid.LESS
              ? 'Symbol must be at least 4 bytes.'
              : invalidSymbol === BytesValid.MUCH
              ? 'Symbol cannot be longer than 64 bytes.'
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
