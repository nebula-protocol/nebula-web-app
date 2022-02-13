import { useRestrictedNumberInput } from '@libs/use-restricted-input';
import React, {
  ChangeEvent,
  DetailedHTMLProps,
  InputHTMLAttributes,
  ReactNode,
  useCallback,
} from 'react';
import { EmptyTextInput } from './EmptyTextInput';
import { InputContainer } from './Input';

export interface TokenInputMinimalProps<T extends string>
  extends Omit<
    DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
    'onChange' | 'value' | 'type' | 'ref'
  > {
  value: T;
  onChange: (nextValue: T) => void;
  type?: 'decimal' | 'integer';
  maxDecimalPoints?: number;
  maxIntegerPoints?: number;
  token?: ReactNode;
  error?: ReactNode;
  children?: ReactNode;
}

export function TokenInputMinimal<T extends string>({
  className,
  style,
  type = 'decimal',
  maxDecimalPoints,
  maxIntegerPoints,
  value,
  onChange,
  pattern = '[0-9.]*',
  token,
  error,
  children,
  ...inputProps
}: TokenInputMinimalProps<T>) {
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
      <div style={{ width: '100%', display: 'flex' }}>
        {token}
        <EmptyTextInput
          style={{ padding: 0, width: '100%', textAlign: 'right' }}
          {...inputProps}
          {...handlers}
          type="text"
          value={value}
        />
        {children && <footer>{children}</footer>}
      </div>
      {error && (
        <aside style={{ fontSize: '0.9em', transform: 'translateY(0.5em)' }}>
          {error}
        </aside>
      )}
    </InputContainer>
  );
}
