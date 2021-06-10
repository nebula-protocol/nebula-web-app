import { useRestrictedNumberInput } from '@terra-dev/use-restricted-input';
import React, {
  ChangeEvent,
  DetailedHTMLProps,
  InputHTMLAttributes,
  ReactNode,
  useCallback,
} from 'react';
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
}

export function TokenInput<T extends string>({
  className,
  type = 'decimal',
  maxDecimalPoints,
  maxIntegerPoints,
  value,
  onChange,
  pattern = '[0-9.]*',
  token,
  suggest,
  label,
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
    <div className={className}>
      <div>
        {label}
        {suggest}
      </div>
      <div>
        {token}
        <EmptyTextInput {...inputProps} {...handlers} type="text" />
      </div>
    </div>
  );
}
