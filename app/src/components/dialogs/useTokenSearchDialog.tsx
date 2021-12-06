import { useTokenSearch } from '@libs/app-provider';
import { terraswap } from '@libs/types';
import { DialogProps, OpenDialog, useDialog } from '@libs/use-dialog';
import { Modal } from '@material-ui/core';
import { useNebulaApp } from '@nebula-js/app-provider';
import { Dialog } from '@nebula-js/ui';
import { useWallet } from '@terra-money/use-wallet';
import React, {
  ChangeEvent,
  ReactNode,
  useCallback,
  useMemo,
  useState,
} from 'react';
import styled from 'styled-components';
import { SearchIcon } from '../../@nebula-js/icons';

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
        <h1>Search tokens</h1>
        <div>
          <SearchBox>
            <StyledSearchIcon />
            <SearchInput
              placeholder="Search tokens to add"
              onChange={onSearch}
            />
          </SearchBox>

          <ul className="token-list">
            {filteredSearchResult.length < 1 ? (
              <Empty>No results found.</Empty>
            ) : (
              filteredSearchResult.map(({ icon, protocol, symbol, asset }) => (
                <ListItem
                  key={symbol}
                  onClick={() => closeDialog(asset)}
                  icon={icon}
                  symbol={symbol}
                  description={protocol}
                />
              ))
            )}
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
    margin-bottom: 28px;
  }

  .address {
    margin-top: 1.42857142857143em;
  }

  .connect {
    margin-top: 2.85714285714286em;
  }

  .token-list {
    padding: 0;
    min-height: 130px;
    max-height: 50vh;
    overflow-x: hidden;
    overflow-y: auto;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
    border: solid 1px var(--color-gray34);
    border-top: none;

    li {
      cursor: pointer;
      display: flex;
      align-items: center;
      padding: 20px 26px;
      &:hover {
        background-color: var(--color-gray22);
      }
    }

    img {
      max-width: 30px;
      margin-right: 12px;
    }
  }
`;

const SearchBox = styled.div`
  display: flex;
  align-items: center;
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  background-color: var(--color-gray14);
  padding: 20px;
  border: solid 1px var(--color-gray34);
  border-bottom: none;
`;

const SearchInput = styled.input`
  margin: 0;
  padding: 0;
  border: 0;
  outline: none;
  font-size: 100%;
  font: inherit;
  width: 100%;
  background-color: inherit;
  color: var(--color-white92);
  font-size: var(--font-size16-14);
`;

const StyledSearchIcon = styled(SearchIcon)`
  font-size: 14px;
  margin-right: 12px;
  color: var(--color-blue01);
`;

const Empty = styled.li`
  cursor: none;
  justify-content: center;
  padding-top: 32px;
`;
