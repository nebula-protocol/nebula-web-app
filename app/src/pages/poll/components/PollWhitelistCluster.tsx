import { useTerraTokenInfo } from '@libs/app-provider';
import { formatPercentage } from '@libs/formatter';
import { HumanAddr, Percent, terraswap } from '@libs/types';
import {
  BytesValid,
  useValidateStringBytes,
} from '@libs/use-string-bytes-length';
import { InputAdornment } from '@material-ui/core';
import { useNebulaApp } from '@nebula-js/app-provider';
import { cluster_factory, gov } from '@nebula-js/types';
import { FormLabel, NumberInput, TextInput } from '@nebula-js/ui';
import { AccAddress } from '@terra-money/terra.js';
import big, { Big } from 'big.js';
import { useTokenSearchDialog } from 'components/dialogs/useTokenSearchDialog';
import React, { useCallback, useMemo, useState } from 'react';
import { PollCreateBase } from './PollCreateBase';

interface Asset {
  asset: terraswap.AssetInfo;
  allocation: Percent;
}

export default function PollWhitelistCluster() {
  const { contractAddress } = useNebulaApp();

  // ---------------------------------------------
  // states
  // ---------------------------------------------
  const [symbol, setSymbol] = useState<string>('');
  const [clusterName, setClusterName] = useState<string>('');
  const [priceOracleAddress, setPriceOracleAddress] = useState<string>('');
  const [compositionOracleAddress, setCompositionOracleAddress] =
    useState<string>('');
  const [penaltyAddress, setPenaltyAddress] = useState<string>('');
  const [assets, setAssets] = useState<Asset[]>(() => []);

  // ---------------------------------------------
  // logics
  // ---------------------------------------------
  const { totalPercentage, validAssets } = useMemo(() => {
    let total = big(0);
    let valid = true;

    for (const { allocation } of assets) {
      if (allocation.length > 0 && big(allocation).gt(0)) {
        total = total.plus(allocation);
      } else {
        valid = false;
      }
    }

    if (!total.eq(100)) {
      valid = false;
    }

    return {
      totalPercentage: total as Percent<Big>,
      validAssets: valid,
    };
  }, [assets]);

  const invalidSymbol = useValidateStringBytes(symbol, 4, 64);

  const invalidClusterName = useValidateStringBytes(clusterName, 4, 64);

  const invalidPriceOracleAddress = useMemo(() => {
    if (priceOracleAddress.length === 0) {
      return undefined;
    }
    return !AccAddress.validate(priceOracleAddress)
      ? 'Invalid terra address'
      : undefined;
  }, [priceOracleAddress]);

  const invalidCompositionOracleAddress = useMemo(() => {
    if (compositionOracleAddress.length === 0) {
      return undefined;
    }
    return !AccAddress.validate(compositionOracleAddress)
      ? 'Invalid terra address'
      : undefined;
  }, [compositionOracleAddress]);

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
          assets: assets.map(({ asset }) => asset),
          target: assets.map(({ allocation }) => parseInt(allocation)),
          name: clusterName,
          symbol: symbol,
          composition_oracle: compositionOracleAddress as HumanAddr,
          pricing_oracle: priceOracleAddress as HumanAddr,
          penalty: penaltyAddress as HumanAddr,
        },
      },
    };

    const executeMsg: gov.ExecuteMsg = {
      contract: contractAddress.gov,
      msg: Buffer.from(JSON.stringify(clusterFactoryCreateCluster)).toString(
        'base64',
      ),
    };

    return executeMsg;
  }, [
    assets,
    clusterName,
    compositionOracleAddress,
    contractAddress.gov,
    penaltyAddress,
    priceOracleAddress,
    symbol,
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
        symbol.length > 0 &&
        clusterName.length > 0 &&
        priceOracleAddress.length > 0 &&
        compositionOracleAddress.length > 0 &&
        penaltyAddress.length > 0 &&
        validAssets &&
        !invalidSymbol &&
        !invalidClusterName &&
        !invalidPriceOracleAddress &&
        !invalidCompositionOracleAddress &&
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
          value={symbol}
          onChange={({ target }) => setSymbol(target.value)}
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

      <FormLabel label="Composition Oracle Address" className="form-label">
        <TextInput
          placeholder="terra1..."
          fullWidth
          value={compositionOracleAddress}
          onChange={({ target }) => setCompositionOracleAddress(target.value)}
          error={!!invalidCompositionOracleAddress}
          helperText={invalidCompositionOracleAddress}
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

      <FormLabel
        label="Tokens"
        className="form-label"
        aside={<span>{formatPercentage(totalPercentage)}%</span>}
      >
        <ClusterAssetsForm assets={assets} onAssetsChange={setAssets} />
      </FormLabel>
    </PollCreateBase>
  );
}

interface ClusterAssetsFormProps {
  assets: Asset[];
  onAssetsChange: (
    nextAssets: Asset[] | ((prevAssets: Asset[]) => Asset[]),
  ) => void;
}

function ClusterAssetsForm({ assets, onAssetsChange }: ClusterAssetsFormProps) {
  const [search, searchDialogElement] = useTokenSearchDialog();

  const openSearch = useCallback(async () => {
    const existsAssets = assets.map(({ asset }) => asset);
    const selectedAsset = await search({ existsAssets });

    if (selectedAsset) {
      onAssetsChange((prev) => {
        return [
          ...prev,
          {
            asset: selectedAsset,
            allocation: '' as Percent,
          },
        ];
      });
    }
  }, [assets, onAssetsChange, search]);

  const onAllocationChange = useCallback(
    (asset: terraswap.AssetInfo, nextAllocation: Percent) => {
      onAssetsChange((prev) => {
        const assetIndex = prev.findIndex(
          (targetAsset) => targetAsset.asset === asset,
        );
        const next = [...prev];
        next[assetIndex] = {
          asset,
          allocation: nextAllocation,
        };
        return next;
      });
    },
    [onAssetsChange],
  );

  const onRemoveAsset = useCallback(
    (asset: terraswap.AssetInfo) => {
      onAssetsChange((prev) => {
        return prev.filter((targetAsset) => targetAsset.asset !== asset);
      });
    },
    [onAssetsChange],
  );

  return (
    <section>
      <table>
        <thead>
          <tr>
            <th>Token Name</th>
            <th>Allocation</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {assets.map(({ asset, allocation }, i) => (
            <tr key={`asset-${i}`}>
              <ClusterAssetLabel asset={asset} />
              <td>
                <NumberInput
                  value={allocation}
                  type="integer"
                  maxIntegerPoints={2}
                  onChange={(nextAllocation) =>
                    onAllocationChange(asset, nextAllocation)
                  }
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">%</InputAdornment>
                    ),
                  }}
                />
              </td>
              <td>
                <button onClick={() => onRemoveAsset(asset)}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={openSearch}>Token Search</button>
      {searchDialogElement}
    </section>
  );
}

function ClusterAssetLabel({ asset }: { asset: terraswap.AssetInfo }) {
  const { data: tokenInfo } = useTerraTokenInfo(asset);

  return tokenInfo ? (
    <td>
      <p>{tokenInfo.symbol}</p>
      <p>{tokenInfo.symbol !== tokenInfo.name ? tokenInfo.name : null}</p>
    </td>
  ) : (
    <td />
  );
}
