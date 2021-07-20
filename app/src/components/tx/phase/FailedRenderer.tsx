import { ErrorOutlineRounded } from '@material-ui/icons';
import { Button, useScreenSizeValue } from '@nebula-js/ui';
import {
  CreateTxFailed,
  Timeout,
  TxFailed,
  TxUnspecifiedError,
  UserDenied,
} from '@terra-money/wallet-provider';
import { TxErrorRendering, TxReceipt } from '@terra-money/webapp-fns';
import { MessageBox } from 'components/boxes/MessageBox';
import { fixHMR } from 'fix-hmr';
import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { TxReceipts } from '../TxReceipts';
import { Layout } from './Layout';

export interface FailedRendererProps {
  className?: string;
  failedReason: TxErrorRendering;
  receipts: (TxReceipt | undefined | null | false)[];
  onClose?: () => void | undefined;
}

function FailedRendererBase({
  className,
  failedReason,
  receipts,
  onClose,
}: FailedRendererProps) {
  const buttonSize = useScreenSizeValue<'medium' | 'normal'>({
    mobile: 'medium',
    tablet: 'normal',
    pc: 'normal',
    monitor: 'normal',
  });

  return (
    <Layout className={className}>
      <figure>
        <ErrorOutlineRounded style={{ color: 'var(--color-red)' }} />
      </figure>

      {renderTxFailedReason(failedReason)}

      <TxReceipts receipts={receipts} />

      {onClose && (
        <Button color="paleblue" size={buttonSize} onClick={onClose}>
          OK
        </Button>
      )}
    </Layout>
  );
}

export const StyledFailedRenderer = styled(FailedRendererBase)`
  // TODO
`;

export const FailedRenderer = fixHMR(StyledFailedRenderer);

function instanceofWithName<E>(error: unknown, name: string): error is E {
  return error instanceof Error && error.name === name;
}

function renderTxFailedReason({ error, errorId }: TxErrorRendering): ReactNode {
  if (
    error instanceof UserDenied ||
    instanceofWithName<UserDenied>(error, 'UserDenied')
  ) {
    return <h2>User Denied</h2>;
  } else if (
    error instanceof CreateTxFailed ||
    instanceofWithName<CreateTxFailed>(error, 'CreateTxFailed')
  ) {
    return (
      <>
        <h2>Failed to broadcast transaction</h2>

        <MessageBox>{error.message}</MessageBox>
      </>
    );
  } else if (
    error instanceof TxFailed ||
    instanceofWithName<TxFailed>(error, 'TxFailed')
  ) {
    return (
      <>
        <h2>Transaction failed</h2>
        <MessageBox>{error.message}</MessageBox>
      </>
    );
  } else if (
    error instanceof Timeout ||
    instanceofWithName<Timeout>(error, 'Timeout')
  ) {
    return (
      <>
        <h2>Timeout</h2>
        <MessageBox>{error.message}</MessageBox>
      </>
    );
  } else if (
    error instanceof TxUnspecifiedError ||
    instanceofWithName<TxUnspecifiedError>(error, 'TxUnspecifiedError')
  ) {
    return (
      <>
        <h2>Transaction failed</h2>
        <MessageBox>{error.message}</MessageBox>
      </>
    );
  } else {
    return (
      <>
        <h2>Oops, something went wrong!</h2>
        <MessageBox>
          {error instanceof Error ? error.message : String(error)}
        </MessageBox>
      </>
    );
  }
}
