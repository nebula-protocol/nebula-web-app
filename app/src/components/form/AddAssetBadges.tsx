import { terraswap, Token } from '@nebula-js/types';
import { AssetTokenInfo, findAssetTokenInfo } from '@nebula-js/app-fns';
import { fixHMR } from 'fix-hmr';
import React, { DetailedHTMLProps, HTMLAttributes, useMemo } from 'react';
import styled from 'styled-components';

export interface AddAssetBadgesProps
  extends DetailedHTMLProps<
    HTMLAttributes<HTMLUListElement>,
    HTMLUListElement
  > {
  assets: terraswap.Asset<Token>[];
  assetTokenInfos: AssetTokenInfo[];
  addedAssets: Set<terraswap.Asset<Token>>;
  onAdd: (asset: terraswap.Asset<Token>) => void;
}

function AddAssetBadgesBase({
  assets: _assets,
  assetTokenInfos,
  onAdd,
  addedAssets,
  ...ulProps
}: AddAssetBadgesProps) {
  const assets = useMemo(() => {
    return _assets.map((asset) => {
      const info = findAssetTokenInfo(asset.info, assetTokenInfos);

      if (!info) {
        throw new Error(`Undefined asset token info!`);
      }

      return {
        asset,
        ...info,
      };
    });
  }, [_assets, assetTokenInfos]);

  return (
    <ul {...ulProps}>
      {assets.map(({ asset, symbol }) => {
        if (addedAssets.has(asset)) {
          return null;
        }

        return (
          <li key={symbol} onClick={() => onAdd(asset)}>
            {symbol} <span>+</span>
          </li>
        );
      })}
    </ul>
  );
}

export const StyledAddAssetBadges = styled(AddAssetBadgesBase)`
  list-style: none;
  padding: 0;

  display: flex;
  flex-wrap: wrap;
  gap: 0.85714286em;

  li {
    cursor: n-resize;

    background-color: var(--color-gray6);
    padding: 0.42857143em 0.85714286em;
    border-radius: 14px;

    font-weight: 500;

    span {
      color: var(--color-paleblue);
    }
  }
`;

export const AddAssetBadges = fixHMR(StyledAddAssetBadges);
