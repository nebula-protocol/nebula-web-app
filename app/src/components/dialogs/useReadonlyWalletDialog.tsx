import { Modal } from '@material-ui/core';
import {
  Button,
  Dialog,
  NativeSelect,
  TextInput,
  useScreenSizeValue,
} from '@nebula-js/ui';
import { ReadonlyWalletSession } from '@terra-dev/readonly-wallet';
import { DialogProps, OpenDialog, useDialog } from '@terra-dev/use-dialog';
import { NetworkInfo } from '@terra-dev/wallet-types';
import { AccAddress } from '@terra-money/terra.js';
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
  networks: NetworkInfo[];
}

type FormReturn = ReadonlyWalletSession | null;

export function useReadonlyWalletDialog(): [
  OpenDialog<FormParams, FormReturn>,
  ReactNode,
] {
  return useDialog(Component);
}

function ComponentBase({
  className,
  networks,
  closeDialog,
}: DialogProps<FormParams, FormReturn>) {
  const [chainID, setChainID] = useState<string>(() => networks[1].chainID);
  const [address, setAddress] = useState<string>('');

  const buttonSize = useScreenSizeValue<'medium' | 'normal'>({
    mobile: 'medium',
    tablet: 'normal',
    pc: 'normal',
    monitor: 'normal',
  });

  const invalidAddress = useMemo(() => {
    if (address.length === 0) {
      return undefined;
    }

    return !AccAddress.validate(address) ? 'Invalid address' : undefined;
  }, [address]);

  const submit = useCallback(
    (terraAddress: string, networkChainID: string) => {
      if (AccAddress.validate(terraAddress)) {
        closeDialog({
          terraAddress,
          network:
            networks.find((item) => item.chainID === networkChainID) ??
            networks[0],
        });
      }
    },
    [closeDialog, networks],
  );

  return (
    <Modal open onClose={() => closeDialog(null)}>
      <Dialog className={className} onClose={() => closeDialog(null)}>
        <h1>View Address</h1>

        {/* Network */}
        <div className="network-description">
          <p>Network</p>
          <p />
        </div>

        <NativeSelect
          fullWidth
          value={chainID}
          onChange={({ target }: ChangeEvent<HTMLSelectElement>) =>
            setChainID(target.value)
          }
        >
          {networks.map((item) => (
            <option key={item.chainID} value={item.chainID}>
              {item.name} ({item.chainID})
            </option>
          ))}
        </NativeSelect>

        {/* Address */}
        <div className="address-description">
          <p>Wallet Address</p>
          <p />
        </div>

        <TextInput
          className="address"
          fullWidth
          multiline
          placeholder="ADDRESS"
          value={address}
          error={!!invalidAddress}
          helperText={invalidAddress}
          onChange={({ target }: ChangeEvent<HTMLInputElement>) =>
            setAddress(target.value)
          }
        />

        <Button
          fullWidth
          size={buttonSize}
          color="paleblue"
          className="connect"
          disabled={address.length === 0 || !!invalidAddress}
          onClick={() => submit(address, chainID)}
        >
          View
        </Button>
      </Dialog>
    </Modal>
  );
}

const Component = styled(ComponentBase)`
  width: 580px;

  h1 {
    font-size: 1.42857143em;
    text-align: center;
    margin-bottom: 2.28571429em;
  }

  .address-description,
  .network-description {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 12px;
    color: var(--color-white64);

    > :last-child {
      font-size: 12px;
    }

    margin-bottom: 12px;
  }

  .address-description {
    margin-top: 20px;
  }

  .connect {
    margin-top: 40px;
  }
`;
