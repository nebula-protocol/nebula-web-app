import { terraswap, Token } from '@libs/types';
import { NumberInput } from '@nebula-js/ui';
import { useTokenSearchDialog } from 'components/dialogs/useTokenSearchDialog';
import { TokenLabel } from 'pages/poll/components/TokenLabel';
import React, { useCallback } from 'react';

export interface FormAsset {
  info: terraswap.AssetInfo;
  amount: Token;
}

interface ClusterAssetsFormProps {
  assets: FormAsset[];
  onAssetsChange: (
    nextAssets: FormAsset[] | ((prevAssets: FormAsset[]) => FormAsset[]),
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
            amount: '' as Token,
          } as FormAsset,
        ];
      });
    }
  }, [assets, onAssetsChange, search]);

  const onTargetChange = useCallback(
    (asset: terraswap.AssetInfo, nextAmount: Token) => {
      onAssetsChange((prev) => {
        const assetIndex = prev.findIndex(
          (targetAsset) => targetAsset.info === asset,
        );
        const next = [...prev];
        next[assetIndex] = {
          info: asset,
          amount: nextAmount,
        } as FormAsset;
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
              <td>
                <TokenLabel assetInfo={info} />
              </td>
              <td>
                <NumberInput<Token>
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
