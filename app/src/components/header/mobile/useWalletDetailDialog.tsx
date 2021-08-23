import { Modal } from '@material-ui/core';
import { Dialog } from '@nebula-js/ui';
import { DialogProps, OpenDialog, useDialog } from '@libs/use-dialog';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { WalletDetails } from '../wallet-details';

interface FormParams {
  className?: string;
}

type FormReturn = void;

export function useWalletDetailDialog(): [
  OpenDialog<FormParams, FormReturn>,
  ReactNode,
] {
  return useDialog(Component);
}

function ComponentBase({
  className,
  closeDialog,
}: DialogProps<FormParams, FormReturn>) {
  const connectedWallet = useConnectedWallet();

  if (!connectedWallet) {
    return null;
  }

  return (
    <Modal open onClose={() => closeDialog()}>
      <Dialog className={className} onClose={() => closeDialog()}>
        <WalletDetails buttonSize="medium" onExit={() => closeDialog()} />
      </Dialog>
    </Modal>
  );
}

const Component = styled(ComponentBase)`
  width: 720px;
`;
