import { Modal } from '@material-ui/core';
import { Clear } from '@material-ui/icons';
import { terraswap, Token } from '@nebula-js/types';
import { Dialog, EmptyButton, IconAndLabels, Search } from '@nebula-js/ui';
import { findAssetTokenInfo, AssetTokenInfo } from '@nebula-js/app-fns';
import { DialogProps, OpenDialog, useDialog } from '@libs/use-dialog';
import React, { ReactNode, useMemo, useState } from 'react';
import styled from 'styled-components';

interface FormParams {
  className?: string;
  title: ReactNode;
  assets: terraswap.Asset<Token>[];
  assetTokenInfos: AssetTokenInfo[];
}

type FormReturn = terraswap.Asset<Token> | null;

export function useAssetSelectDialog(): [
  OpenDialog<FormParams, FormReturn>,
  ReactNode,
] {
  return useDialog(Component);
}

function ComponentBase({
  className,
  title,
  assets: _assets,
  assetTokenInfos,
  closeDialog,
}: DialogProps<FormParams, FormReturn>) {
  const [search, setSearch] = useState<string>('');

  const assets = useMemo(() => {
    return _assets.map((asset) => {
      const info = findAssetTokenInfo(asset.info, assetTokenInfos);

      if (!info) {
        throw new Error(`Undefined asset token info!`);
      }

      return {
        asset,
        ...info,
        searchText: info.symbol.toLowerCase() + info.name.toLowerCase(),
      };
    });
  }, [_assets, assetTokenInfos]);

  const filteredAssets = useMemo(() => {
    if (search.trim().length === 0) {
      return assets;
    }

    return assets.filter(({ searchText }) => {
      return searchText.indexOf(search.toLowerCase()) > -1;
    });
  }, [assets, search]);

  return (
    <Modal open onClose={() => closeDialog(null)}>
      <Dialog className={className} onClose={() => closeDialog(null)}>
        <h1>{title}</h1>

        <Search
          className="search"
          type="text"
          value={search}
          onChange={({ target }) => setSearch(target.value)}
        >
          <EmptyButton onClick={() => setSearch('')}>
            <Clear />
          </EmptyButton>
        </Search>

        <ul>
          {filteredAssets.map(({ asset, name, symbol }, i) => (
            <li key={'asset' + i} onClick={() => closeDialog(asset)}>
              <IconAndLabels subtext={name} text={symbol} />
            </li>
          ))}
        </ul>
      </Dialog>
    </Modal>
  );
}

const Component = styled(ComponentBase)`
  width: 550px;

  h1 {
    font-size: 1.14285714em;
    font-weight: 500;
    text-align: center;

    margin-bottom: 2.14285714em;
  }

  .search {
    height: 3rem;
    padding-left: 1.5rem;

    .end {
      padding-right: 1.5rem;
    }

    &:focus-within {
      background-color: var(--color-gray14);
    }
  }

  ul {
    list-style: none;
    padding: 1rem 0;

    overflow-x: hidden;
    overflow-y: auto;

    max-height: 70vh;
    min-height: 30vh;

    li {
      padding: 1rem 0;

      cursor: pointer;

      &:hover {
        background-color: var(--color-gray22);
      }
    }
  }
`;
