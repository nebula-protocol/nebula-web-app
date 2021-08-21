import { useRestrictedNumberInput } from '@packages/use-restricted-input';
import React, {
  ChangeEvent,
  DetailedHTMLProps,
  InputHTMLAttributes,
  ReactNode,
  useCallback,
} from 'react';
import { EmptyTextInput } from './EmptyTextInput';
import { InputContainer } from './Input';

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
    <InputContainer className={className} style={style} aria-invalid={!!error}>
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
    </InputContainer>
  );
}
