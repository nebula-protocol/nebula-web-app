import { truncate } from '@libs/formatter';
import { Meta } from '@storybook/react';
import { Timeout, UserDenied } from '@terra-money/use-wallet';
import {
  CreateTxFailed,
  TxFailed,
  TxUnspecifiedError,
} from '@terra-money/wallet-provider';
import { TxResultRendering, TxStreamPhase } from '@libs/app-fns';
import { TxMiniRenderer } from 'components/tx/TxMiniRenderer';
import { TxRenderer } from 'components/tx/TxRenderer';
import React, { useState } from 'react';

export default {
  title: 'app/Tx',
} as Meta;

const Render = ({ result }: { result: TxResultRendering }) => {
  const [minified, setMinified] = useState<boolean>(false);

  return !minified ? (
    <TxRenderer
      result={result}
      onClose={() => console.log('close!')}
      onMinify={() => setMinified(true)}
    />
  ) : (
    <TxMiniRenderer result={result} onExpand={() => setMinified(false)} />
  );
};

const receipts = [
  {
    name: 'Tx Fee',
    value: {
      html: `<a href="https://finder.extraterrestrial.money/mainnet/tx/AA3CE57592814E092D3247F6CE7E8DECCA9164DB2087C53434AF6B74F59FB71E" target="_blank" rel="noreferrer">${truncate(
        'AA3CE57592814E092D3247F6CE7E8DECCA9164DB2087C53434AF6B74F59FB71E',
      )}</a>`,
    },
  },
];

export const Render_Post = () => {
  return (
    <Render
      result={{
        phase: TxStreamPhase.POST,
        value: {} as any,
        receipts,
      }}
    />
  );
};

export const Render_Broadcast = () => {
  return (
    <Render
      result={{
        phase: TxStreamPhase.BROADCAST,
        value: {} as any,
        receipts,
      }}
    />
  );
};

export const Render_Succeed = () => {
  return (
    <Render
      result={{
        phase: TxStreamPhase.SUCCEED,
        value: {} as any,
        receipts,
      }}
    />
  );
};

export const Render_Failed_UserDenied = () => {
  return (
    <Render
      result={{
        phase: TxStreamPhase.FAILED,
        value: {} as any,
        failedReason: {
          error: new UserDenied(),
        },
        receipts,
      }}
    />
  );
};

export const Render_Failed_CreateTxFailed = () => {
  return (
    <Render
      result={{
        phase: TxStreamPhase.FAILED,
        value: {} as any,
        failedReason: {
          error: new CreateTxFailed(
            {} as any,
            'execute wasm contract failed: generic: Operation exceeds max spread limit: failed to execute message; message index: 0',
          ),
        },
        receipts,
      }}
    />
  );
};

export const Render_Failed_TxFailed = () => {
  return (
    <Render
      result={{
        phase: TxStreamPhase.FAILED,
        value: {} as any,
        failedReason: {
          error: new TxFailed(
            {} as any,
            'AA3CE57592814E092D3247F6CE7E8DECCA9164DB2087C53434AF6B74F59FB71E',
            'execute wasm contract failed: generic: Operation exceeds max spread limit: failed to execute message; message index: 0',
            '',
          ),
        },
        receipts,
      }}
    />
  );
};

export const Render_Failed_Timeout = () => {
  return (
    <Render
      result={{
        phase: TxStreamPhase.FAILED,
        value: {} as any,
        failedReason: {
          error: new Timeout('Timeout message'),
        },
        receipts,
      }}
    />
  );
};

export const Render_Failed_UnspecifiedError = () => {
  return (
    <Render
      result={{
        phase: TxStreamPhase.FAILED,
        value: {} as any,
        failedReason: {
          error: new TxUnspecifiedError({} as any, 'Unspecified message'),
        },
        receipts,
      }}
    />
  );
};

export const Render_Failed_Error = () => {
  return (
    <Render
      result={{
        phase: TxStreamPhase.FAILED,
        value: {} as any,
        failedReason: {
          error: new Error('Unknown message'),
        },
        receipts,
      }}
    />
  );
};
