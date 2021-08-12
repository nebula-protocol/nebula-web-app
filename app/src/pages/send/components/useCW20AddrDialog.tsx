import { Modal } from '@material-ui/core';
import { CW20Addr } from '@nebula-js/types';
import { Button, Dialog, TextInput, useScreenSizeValue } from '@nebula-js/ui';
import { DialogProps, OpenDialog, useDialog } from '@terra-dev/use-dialog';
import { AccAddress } from '@terra-money/terra.js';
import React, { ReactNode, useMemo, useState } from 'react';
import styled from 'styled-components';

interface FormParams {
  className?: string;
  cw20Addrs: CW20Addr[];
}

type FormReturn = CW20Addr | null;

export function useCW20AddrDialog(): [
  OpenDialog<FormParams, FormReturn>,
  ReactNode,
] {
  return useDialog(Component);
}

function ComponentBase({
  className,
  cw20Addrs,
  closeDialog,
}: DialogProps<FormParams, FormReturn>) {
  const [addr, setAddr] = useState<string>('');

  const invalidAddr = useMemo(() => {
    if (addr.length === 0) {
      return null;
    }

    return !AccAddress.validate(addr)
      ? 'Invalid address'
      : cw20Addrs.some((targetAddr) => targetAddr === addr)
      ? 'Already added'
      : null;
  }, [addr, cw20Addrs]);

  // ---------------------------------------------
  // presentation
  // ---------------------------------------------
  const buttonSize = useScreenSizeValue<'normal' | 'medium'>({
    mobile: 'medium',
    tablet: 'normal',
    pc: 'normal',
    monitor: 'normal',
  });

  return (
    <Modal open onClose={() => closeDialog(null)}>
      <Dialog className={className} onClose={() => closeDialog(null)}>
        <h1>Add CW20 Token Address</h1>

        <TextInput
          fullWidth
          value={addr}
          placeholder="terra1..."
          onChange={({ target }) => setAddr(target.value)}
          error={!!invalidAddr}
          helperText={invalidAddr}
        />

        <footer>
          <Button
            fullWidth
            className="submit"
            color="paleblue"
            size={buttonSize}
            disabled={addr.length === 0 || !!invalidAddr}
            onClick={() => {
              closeDialog(addr as CW20Addr);
            }}
          >
            Add
          </Button>
        </footer>
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

  .submit {
    display: block;
    max-width: 200px;
    margin: 1.78571428571429em auto 0 auto;
  }
`;
