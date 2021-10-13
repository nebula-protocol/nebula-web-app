import { useTokenSearch } from '@libs/app-provider';
import { terraswap } from '@libs/types';
import { DialogProps, OpenDialog, useDialog } from '@libs/use-dialog';
import { Modal } from '@material-ui/core';
import { useNebulaApp } from '@nebula-js/app-provider';
import { Dialog, TextInput } from '@nebula-js/ui';
import { useWallet } from '@terra-dev/use-wallet';
import React, { ChangeEvent, ReactNode, useCallback, useState } from 'react';
import styled from 'styled-components';

interface FormParams {
  className?: string;
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
  closeDialog,
}: DialogProps<FormParams, FormReturn>) {
  const { network } = useWallet();
  const { queryClient } = useNebulaApp();

  const [searchText, setSearchText] = useState<string>('');

  const searchResult = useTokenSearch(searchText, network, queryClient);

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
            {searchResult.map(({ icon, protocol, symbol, asset }) => (
              <ListItem
                key={symbol}
                onClick={() => closeDialog(asset)}
                icon={icon}
                symbol={symbol}
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
}: {
  onClick: () => void;
  symbol: string;
  icon: string;
}) {
  const [failedLoadImage, setFailedLoadImage] = useState<boolean>(false);

  return failedLoadImage ? null : (
    <li onClick={onClick}>
      <img src={icon} alt={symbol} onError={() => setFailedLoadImage(true)} />
      {symbol}
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
