import { useRestrictedNumberInput } from '@terra-dev/use-restricted-input';
import React, {
  ChangeEvent,
  DetailedHTMLProps,
  InputHTMLAttributes,
  ReactNode,
  useCallback,
} from 'react';
import styled from 'styled-components';
import { EmptyTextInput } from './EmptyTextInput';

export interface TokenInputProps<T extends string>
  extends Omit<
    DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
    'onChange' | 'value' | 'type' | 'ref'
  > {
  value: T;
  onChange: (nextValue: T) => void;
  type?: 'decimal' | 'integer';
  maxDecimalPoints?: number;
  maxIntegerPoints?: number;
  label: ReactNode;
  suggest?: ReactNode;
  token?: ReactNode;
  error?: ReactNode;
  children?: ReactNode;
}

export function TokenInput<T extends string>({
  className,
  style,
  type = 'decimal',
  maxDecimalPoints,
  maxIntegerPoints,
  value,
  onChange,
  pattern = '[0-9.]*',
  token,
  suggest,
  label,
  error,
  children,
  ...inputProps
}: TokenInputProps<T>) {
  const inputOnChange = useCallback(
    ({ target }: ChangeEvent<HTMLInputElement>) => {
      onChange(target.value as T);
    },
    [onChange],
  );

  const handlers = useRestrictedNumberInput({
    type,
    maxIntegerPoinsts: maxIntegerPoints,
    maxDecimalPoints,
    onChange: inputOnChange,
  });

  return (
    <Container className={className} style={style} aria-invalid={!!error}>
      <header>
        {label}
        {suggest}
      </header>
      <div>
        {token}
        <EmptyTextInput
          {...inputProps}
          {...handlers}
          type="text"
          value={value}
        />
      </div>
      {children && <footer>{children}</footer>}
      {error && <aside>{error}</aside>}
    </Container>
  );
}

const Container = styled.div`
  position: relative;

  font-size: 1em;

  border: 1px solid var(--color-gray34);
  border-radius: 8px;

  --token-input-padding: 20px;

  padding: 18px var(--token-input-padding) 8px var(--token-input-padding);

  > header {
    display: flex;
    justify-content: space-between;
    align-items: center;

    font-size: 0.9em;
    color: var(--color-white44);
    line-height: 12px;

    margin-bottom: 10px;
  }

  > :nth-child(2) {
    display: flex;
    align-items: center;
    gap: 1em;

    font-size: 1.2em;

    height: 2.5em;

    color: var(--color-white92);

    > input {
      min-width: 0;

      flex: 1;
      align-self: stretch;

      font-size: inherit;

      text-align: right;
    }
  }

  > footer {
    border-top: 1px solid var(--color-gray22);
    padding-top: 8px;
    padding-left: var(--token-input-padding);
    padding-right: var(--token-input-padding);
    margin-top: 8px;
    margin-left: calc(var(--token-input-padding) * -1);
    margin-right: calc(var(--token-input-padding) * -1);
  }

  > aside {
    position: absolute;

    font-size: 0.9em;
    font-weight: 400;

    right: 0.4em;
    bottom: -1.5em;

    text-align: right;
  }

  &:focus-within {
    border: 1px solid var(--color-white52);
  }
`;
