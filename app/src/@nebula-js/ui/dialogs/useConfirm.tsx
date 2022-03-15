import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';
import { DialogProps, OpenDialog, useDialog } from '@libs/use-dialog';
import React, { ReactNode } from 'react';
import { Button } from '../buttons/Button';
import { useAlertStyles } from './useAlert';
import styled from 'styled-components';

export function useConfirm(): [OpenDialog<ConfirmParams, boolean>, ReactNode] {
  return useDialog(Component as any);
}

export interface ConfirmParams {
  className?: string;
  title?: ReactNode;
  description: ReactNode;
  agree?: string;
  disagree?: string;
}

function ComponentBase({
  className,
  closeDialog,
  title,
  description,
  agree = 'Agree',
  disagree = 'Disagree',
}: DialogProps<ConfirmParams, boolean>) {
  const classes = useAlertStyles();

  return (
    <Dialog
      open
      classes={classes}
      onClose={() => closeDialog(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      className={className}
    >
      {title && <DialogTitle id="alert-dialog-title">{title}</DialogTitle>}

      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {description}
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button className="btn" onClick={() => closeDialog(false)}>
          {disagree}
        </Button>
        <Button
          className="btn"
          autoFocus
          style={{ backgroundColor: 'var(--color-red01)' }}
          onClick={() => closeDialog(true)}
        >
          {agree}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

const Component = styled(ComponentBase)`
  .btn {
    width: 100px;
    height: 2.5em;
    font-size: var(--font-size16-14);
  }
`;
