import React, {
  DetailedHTMLProps,
  HTMLAttributes,
  ReactNode,
  useCallback,
  useRef,
  useState,
} from 'react';
import styled from 'styled-components';
import { breakpoints } from '../env';

export interface SwitchItem<T extends string> {
  label: ReactNode;
  value: T;
}

export interface SwitchInputProps<T extends string>
  extends Omit<
    DetailedHTMLProps<HTMLAttributes<HTMLUListElement>, HTMLUListElement>,
    'onChange' | 'ref' | 'children'
  > {
  items: SwitchItem<T>[];
  value: T;
  customLabel?: ReactNode;
  initialCustomValue: T;
  onChange: (nextValue: T) => void;
  children: (params: {
    value: T;
    onChange: (nextValue: T) => void;
  }) => ReactNode;
}

export function SwitchInput<T extends string>({
  items,
  customLabel = 'CUSTOM',
  initialCustomValue,
  value,
  onChange,
  children,
  ...ulProps
}: SwitchInputProps<T>) {
  const latestCustomValue = useRef(initialCustomValue);

  const [customSelected, setCustomSelected] = useState<boolean>(() => {
    return !items.some(({ value: itemValue }) => itemValue === value);
  });

  const onSwitchSelect = useCallback(
    (nextValue: T) => {
      setCustomSelected(false);
      onChange(nextValue);
    },
    [onChange],
  );

  const onCustomSelect = useCallback(() => {
    setCustomSelected(true);
    onChange(latestCustomValue.current);
  }, [onChange]);

  const onCustomValueUpdate = useCallback(
    (nextValue: T) => {
      onChange(nextValue);
      latestCustomValue.current = nextValue;
    },
    [onChange],
  );

  return (
    <StyledUL {...ulProps} role="radiogroup">
      {items.map(({ value: itemValue, label }) => (
        <li
          role="radio"
          aria-checked={!customSelected && itemValue === value}
          key={'switch-item-' + itemValue}
          onClick={() => onSwitchSelect(itemValue)}
        >
          {label}
        </li>
      ))}
      <li
        role="radio"
        aria-checked={customSelected}
        onClick={() => onCustomSelect()}
      >
        {customLabel}
        {customSelected && (
          <div>{children({ value, onChange: onCustomValueUpdate })}%</div>
        )}
      </li>
    </StyledUL>
  );
}

const StyledUL = styled.ul`
  list-style: none;
  padding: 0;

  display: inline-flex;

  height: 45px;

  --item-min-width: 90px;
  --item-padding: 20px;

  li {
    cursor: pointer;

    display: grid;
    place-content: center;

    min-width: var(--item-min-width);
    padding: 0 var(--item-padding);

    border: 1px solid var(--color-gray34);

    &:not(:first-child) {
      border-left: none;
    }

    &:first-child {
      border-top-left-radius: 8px;
      border-bottom-left-radius: 8px;
    }

    &:last-child {
      border-top-right-radius: 8px;
      border-bottom-right-radius: 8px;

      display: flex;
      align-items: center;

      > div {
        margin-left: 1em;
        background-color: var(--color-gray24);
        border-radius: 16px;
        padding: 0 0.5em;

        display: flex;
        align-items: center;

        input {
          text-align: right;
          max-width: 60px;
          padding: 0.5em 0.1em;
        }
      }
    }

    &[aria-checked='true'] {
      background-color: var(--color-paleblue);
    }
  }

  @media (max-width: ${breakpoints.mobile.max}px) {
    display: flex;

    height: 45px;

    li {
      min-width: 0;
      padding: 0 calc(var(--item-padding) / 2);

      &:not(:last-child) {
        flex: 1;
      }

      &:last-child {
        > div {
          margin-left: 0.5em;

          input {
            max-width: 40px;
          }
        }
      }
    }
  }
`;
