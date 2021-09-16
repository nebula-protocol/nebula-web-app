import { Modal } from '@material-ui/core';
import { Dialog, DialogProps } from '@nebula-js/ui';
import { TxResultRendering, TxStreamPhase } from '@libs/app-fns';
import { fixHMR } from 'fix-hmr';
import React, { useCallback } from 'react';
import styled from 'styled-components';
import { BroadcastRenderer } from './phase/BroadcastRenderer';
import { FailedRenderer } from './phase/FailedRenderer';
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
  const onModalClose = useCallback(
    (event: {}, reason: 'backdropClick' | 'escapeKeyDown') => {
      if (reason === 'escapeKeyDown') {
        switch (result.phase) {
          case TxStreamPhase.SUCCEED:
          case TxStreamPhase.FAILED:
            onClose?.();
            break;
        }
      }
    },
    [onClose, result.phase],
  );

  const onDialogClose = useCallback(() => {
    switch (result.phase) {
      case TxStreamPhase.POST:
      case TxStreamPhase.BROADCAST:
        onMinify();
        break;
      default:
        onClose?.();
        break;
    }
  }, [onClose, onMinify, result.phase]);

  return (
    <Modal open onClose={onModalClose} disableEnforceFocus>
      <Dialog {...dialogProps} onClose={onDialogClose}>
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
