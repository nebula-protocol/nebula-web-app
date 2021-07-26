import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';
import { DialogProps, OpenDialog, useDialog } from '@terra-dev/use-dialog';
import React, { ReactNode } from 'react';
import { Button } from '../buttons/Button';
import { useAlertStyles } from './useAlert';

export function useConfirm(): [OpenDialog<ConfirmParams, boolean>, ReactNode] {
  return useDialog(Component as any);
}

export interface ConfirmParams {
  title?: ReactNode;
  description: ReactNode;
  agree?: string;
  disagree?: string;
}

function Component({
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
    >
      {title && <DialogTitle id="alert-dialog-title">{title}</DialogTitle>}

      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {description}
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button style={{ width: 150 }} onClick={() => closeDialog(false)}>
          {disagree}
        </Button>
        <Button
          autoFocus
          style={{ width: 150 }}
          onClick={() => closeDialog(true)}
        >
          {agree}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
