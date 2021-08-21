import {
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { DialogProps, OpenDialog, useDialog } from '@packages/use-dialog';
import React from 'react';
import { ReactNode } from 'react';
import { Button } from '../buttons/Button';

export const useAlertStyles = makeStyles(() =>
  createStyles({
    paper: {
      color: 'var(--color-gray12)',
      backgroundColor: 'var(--color-white44)',
      padding: 10,
    },
  }),
);

type FormReturn = void;

export interface AlertParams {
  title?: ReactNode;
  description: ReactNode;
  agree?: string;
}

export function useAlert(): [OpenDialog<AlertParams, boolean>, ReactNode] {
  return useDialog(Component as any);
}

function Component({
  closeDialog,
  title,
  description,
  agree = 'Agree',
}: DialogProps<AlertParams, FormReturn>) {
  const classes = useAlertStyles();

  return (
    <Dialog
      open
      classes={classes}
      onClose={() => closeDialog()}
      disableBackdropClick
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      style={{ padding: 100 }}
    >
      {title && <DialogTitle id="alert-dialog-title">{title}</DialogTitle>}

      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {description}
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button
          autoFocus
          style={{ width: '100%' }}
          onClick={() => closeDialog()}
        >
          {agree}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
