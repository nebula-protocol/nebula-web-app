import { useTerraTokenInfo } from '@libs/app-provider';
import { terraswap, Token, u } from '@libs/types';
import { NumberInput } from '@nebula-js/ui';
import { useTokenSearchDialog } from 'components/dialogs/useTokenSearchDialog';
import React, { useCallback } from 'react';

interface ClusterAssetsFormProps {
  assets: terraswap.Asset<Token>[];
  onAssetsChange: (
    nextAssets:
      | terraswap.Asset<Token>[]
      | ((prevAssets: terraswap.Asset<Token>[]) => terraswap.Asset<Token>[]),
  ) => void;
}

export function ClusterAssetsForm({
  assets,
  onAssetsChange,
}: ClusterAssetsFormProps) {
  const [search, searchDialogElement] = useTokenSearchDialog();

  const openSearch = useCallback(async () => {
    const existsAssets = assets.map(({ info }) => info);
    const selectedAsset = await search({ existsAssets });

    if (selectedAsset) {
      onAssetsChange((prev) => {
        return [
          ...prev,
          {
            info: selectedAsset,
            amount: '' as u<Token>,
          } as terraswap.Asset<Token>,
        ];
      });
    }
  }, [assets, onAssetsChange, search]);

  const onTargetChange = useCallback(
    (asset: terraswap.AssetInfo, nextAmount: u<Token>) => {
      onAssetsChange((prev) => {
        const assetIndex = prev.findIndex(
          (targetAsset) => targetAsset.info === asset,
        );
        const next = [...prev];
        next[assetIndex] = {
          info: asset,
          amount: nextAmount,
        } as terraswap.Asset<Token>;
        return next;
      });
    },
    [onAssetsChange],
  );

  const onRemoveAsset = useCallback(
    (asset: terraswap.AssetInfo) => {
      onAssetsChange((prev) => {
        return prev.filter((targetAsset) => targetAsset.info !== asset);
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
          {assets.map(({ info, amount }, i) => (
            <tr key={`asset-${i}`}>
              <ClusterAssetLabel asset={info} />
              <td>
                <NumberInput
                  value={amount}
                  type="decimal"
                  maxDecimalPoints={6}
                  onChange={(nextAmount) => onTargetChange(info, nextAmount)}
                />
              </td>
              <td>
                <button onClick={() => onRemoveAsset(info)}>Remove</button>
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
