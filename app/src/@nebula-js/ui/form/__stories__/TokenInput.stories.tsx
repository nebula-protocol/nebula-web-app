import { DeleteOutline } from '@material-ui/icons';
import { WalletIcon } from '@nebula-js/icons';
import { u, UST } from '@nebula-js/types';
import { EmptyButton, TokenInput, TokenSpan } from '@nebula-js/ui';
import { Meta } from '@storybook/react';
import big from 'big.js';
import React, { useMemo, useState } from 'react';

export default {
  title: 'ui/TokenInput',
} as Meta;

export const Basic = () => {
  const [value, setValue] = useState<u<UST>>('' as u<UST>);

  const invalidValue = useMemo(() => {
    return value.length > 0 && big(value).gt(1000)
      ? 'Not enough assets'
      : undefined;
  }, [value]);

  return (
    <TokenInput
      value={value}
      onChange={setValue}
      label="INPUT"
      suggest={
        <EmptyButton onClick={() => setValue('100000' as u<UST>)}>
          <WalletIcon
            style={{
              transform: 'translate(-0.3em, 0)',
            }}
          />{' '}
          100,000 UST
        </EmptyButton>
      }
      token={<TokenSpan>UST</TokenSpan>}
      style={{ width: 400 }}
      error={invalidValue}
    />
  );
};

export const Size = () => {
  const [value, setValue] = useState<u<UST>>('' as u<UST>);

  const invalidValue = useMemo(() => {
    return value.length > 0 && big(value).gt(1000)
      ? 'Not enough assets'
      : undefined;
  }, [value]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '50px' }}>
      {['1em', '0.9em', '0.8em', '12px'].map((fontSize) => (
        <TokenInput
          key={fontSize}
          value={value}
          onChange={setValue}
          label={fontSize.toUpperCase()}
          suggest={
            <EmptyButton onClick={() => setValue('100000' as u<UST>)}>
              <WalletIcon
                style={{
                  transform: 'translate(-0.3em, 0)',
                }}
              />{' '}
              100,000 UST
            </EmptyButton>
          }
          token={<TokenSpan>UST</TokenSpan>}
          style={{ width: 400, fontSize }}
          error={invalidValue}
        />
      ))}
    </div>
  );
};

export const Footer = () => {
  const [value, setValue] = useState<u<UST>>('' as u<UST>);

  const invalidValue = useMemo(() => {
    return value.length > 0 && big(value).gt(1000)
      ? 'Not enough assets'
      : undefined;
  }, [value]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '50px' }}>
      {['1em', '0.9em', '0.8em', '12px'].map((fontSize) => (
        <TokenInput
          key={fontSize}
          value={value}
          onChange={setValue}
          label={fontSize.toUpperCase()}
          suggest={
            <EmptyButton onClick={() => setValue('100000' as u<UST>)}>
              <WalletIcon
                style={{
                  transform: 'translate(-0.3em, 0)',
                }}
              />{' '}
              100,000 UST
            </EmptyButton>
          }
          token={<TokenSpan>UST</TokenSpan>}
          style={{ width: 400, fontSize }}
          error={invalidValue}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <EmptyButton fontSize="1.21428571em">
              <DeleteOutline />
            </EmptyButton>
            <span style={{ fontSize: 'max(0.85714286em, 12px)' }}>
              Target: 1,000,000 UST
            </span>
          </div>
        </TokenInput>
      ))}
    </div>
  );
};
