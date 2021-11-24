import { useTokenSearch } from '@libs/app-provider';
import { terraswap } from '@libs/types';
import { DialogProps, OpenDialog, useDialog } from '@libs/use-dialog';
import { Modal } from '@material-ui/core';
import { useNebulaApp } from '@nebula-js/app-provider';
import { Dialog, TextInput } from '@nebula-js/ui';
import { useWallet } from '@terra-money/use-wallet';
import React, {
  ChangeEvent,
  ReactNode,
  useCallback,
  useMemo,
  useState,
} from 'react';
import styled from 'styled-components';

interface FormParams {
  className?: string;
  existsAssets: terraswap.AssetInfo[];
}

type FormReturn = terraswap.AssetInfo | null;

export function useTokenSearchDialog(): [
  OpenDialog<FormParams, FormReturn>,
  ReactNode,
] {
  return useDialog(Component);
}

function ComponentBase({
  className,
  existsAssets,
  closeDialog,
}: DialogProps<FormParams, FormReturn>) {
  const { network } = useWallet();
  const { queryClient } = useNebulaApp();

  const [searchText, setSearchText] = useState<string>('');

  const searchResult = useTokenSearch(searchText, network, queryClient);

  const filteredSearchResult = useMemo(() => {
    const existsCW20Addrs: Set<string> = new Set<string>();
    const existsNativeDenoms: Set<string> = new Set<string>();

    for (const targetAsset of existsAssets) {
      if ('token' in targetAsset) {
        existsCW20Addrs.add(targetAsset.token.contract_addr);
      } else {
        existsNativeDenoms.add(targetAsset.native_token.denom);
      }
    }

    return searchResult.filter((targetAsset) => {
      if ('token' in targetAsset.asset) {
        return !existsCW20Addrs.has(targetAsset.asset.token.contract_addr);
      } else {
        return !existsNativeDenoms.has(targetAsset.asset.native_token.denom);
      }
    });
  }, [existsAssets, searchResult]);

  const onSearch = useCallback((event: ChangeEvent<{ value: string }>) => {
    setSearchText(event.target.value);
  }, []);

  return (
    <Modal open onClose={() => closeDialog(null)}>
      <Dialog className={className} onClose={() => closeDialog(null)}>
        <h1>Search Token</h1>
        <div>
          <TextInput
            fullWidth
            placeholder="Search symbol or address..."
            onChange={onSearch}
          />

          <ul className="token-list">
            {filteredSearchResult.map(({ icon, protocol, symbol, asset }) => (
              <ListItem
                key={symbol}
                onClick={() => closeDialog(asset)}
                icon={icon}
                symbol={symbol}
                description={protocol}
              />
            ))}
          </ul>
        </div>
      </Dialog>
    </Modal>
  );
}

function ListItem({
  onClick,
  symbol,
  icon,
  description,
}: {
  onClick: () => void;
  symbol: string;
  icon: string;
  description: string;
}) {
  const [failedLoadImage, setFailedLoadImage] = useState<boolean>(false);

  return failedLoadImage ? null : (
    <li onClick={onClick}>
      <img src={icon} alt={symbol} onError={() => setFailedLoadImage(true)} />
      {symbol} - {description}
    </li>
  );
}

const Component = styled(ComponentBase)`
  width: 580px;

  h1 {
    font-size: 1.42857143em;
    text-align: center;
    margin-bottom: 2.28571429em;
  }

  .address {
    margin-top: 1.42857142857143em;
  }

  .connect {
    margin-top: 2.85714285714286em;
  }

  .token-list {
    padding: 0;
    max-height: 50vh;
    overflow-x: hidden;
    overflow-y: auto;

    li {
      cursor: pointer;
    }

    img {
      max-width: 30px;
    }
  }
`;
