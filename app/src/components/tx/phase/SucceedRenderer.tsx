import { DoneAllRounded } from '@material-ui/icons';
import { Button, useScreenSizeValue } from '@nebula-js/ui';
import { TxReceipt } from '@packages/webapp-fns';
import { fixHMR } from 'fix-hmr';
import React from 'react';
import styled from 'styled-components';
import { TxReceipts } from '../TxReceipts';
import { Layout } from './Layout';

export interface SucceedRendererProps {
  className?: string;
  receipts: (TxReceipt | undefined | null | false)[];
  onClose?: () => void | undefined;
}

function SucceedRendererBase({
  className,
  receipts,
  onClose,
}: SucceedRendererProps) {
  const buttonSize = useScreenSizeValue<'medium' | 'normal'>({
    mobile: 'medium',
    tablet: 'normal',
    pc: 'normal',
    monitor: 'normal',
  });

  return (
    <Layout className={className}>
      <figure>
        <DoneAllRounded style={{ color: 'var(--color-paleblue)' }} />
      </figure>

      <h2>Complete</h2>

      <TxReceipts receipts={receipts} />

      {onClose && (
        <Button color="paleblue" size={buttonSize} onClick={onClose}>
          OK
        </Button>
      )}
    </Layout>
  );
}

export const StyledSucceedRenderer = styled(SucceedRendererBase)`
  // TODO
`;

export const SucceedRenderer = fixHMR(StyledSucceedRenderer);
