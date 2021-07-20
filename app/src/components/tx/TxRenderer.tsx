import { Modal } from '@material-ui/core';
import { Dialog, DialogProps } from '@nebula-js/ui';
import { TxResultRendering, TxStreamPhase } from '@terra-money/webapp-fns';
import { FailedRenderer } from './phase/FailedRenderer';
import { fixHMR } from 'fix-hmr';
import React from 'react';
import styled from 'styled-components';
import { BroadcastRenderer } from './phase/BroadcastRenderer';
import { PostRenderer } from './phase/PostRenderer';
import { SucceedRenderer } from './phase/SucceedRenderer';

export interface TxRendererProps extends Omit<DialogProps, 'ref'> {
  result: TxResultRendering;
  onMinify: () => void;
}

function TxRendererBase({
  result,
  onClose,
  onMinify,
  ...dialogProps
}: TxRendererProps) {
  return (
    <Modal open disableBackdropClick onClose={onMinify}>
      <Dialog {...dialogProps} onClose={onMinify}>
        {result.phase === TxStreamPhase.POST ? (
          <PostRenderer receipts={result.receipts} onClose={onClose} />
        ) : result.phase === TxStreamPhase.BROADCAST ? (
          <BroadcastRenderer receipts={result.receipts} />
        ) : result.phase === TxStreamPhase.SUCCEED ? (
          <SucceedRenderer receipts={result.receipts} onClose={onClose} />
        ) : result.phase === TxStreamPhase.FAILED ? (
          <FailedRenderer
            failedReason={result.failedReason!}
            receipts={result.receipts}
            onClose={onClose}
          />
        ) : null}
      </Dialog>
    </Modal>
  );
}

export const StyledTxRenderer = styled(TxRendererBase)`
  width: 580px;
`;

export const TxRenderer = fixHMR(StyledTxRenderer);
