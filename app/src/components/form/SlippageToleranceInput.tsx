import { Rate } from '@libs/types';
import {
  EmptyNumberInput,
  SwitchInput,
  SwitchInputProps,
  SwitchItem,
} from '@nebula-js/ui';
import { fixHMR } from 'fix-hmr';
import React from 'react';
import styled from 'styled-components';

export interface SlippageToleranceInputProps
  extends Omit<SwitchInputProps<Rate>, 'items' | 'children'> {
  className?: string;
}

const slippages: SwitchItem<Rate>[] = [
  { label: '0.1%', value: '0.1' as Rate },
  { label: '0.5%', value: '0.5' as Rate },
  { label: '1%', value: '1' as Rate },
];

function SlippageToleranceInputBase(props: SlippageToleranceInputProps) {
  return (
    <SwitchInput {...props} items={slippages}>
      {(input) => (
        <EmptyNumberInput<Rate>
          autoFocus
          value={input.value}
          onChange={input.onChange}
          type="decimal"
          maxDecimalPoints={2}
          maxIntegerPoints={1}
          placeholder="0.00"
        />
      )}
    </SwitchInput>
  );
}

export const StyledSlippageToleranceInput = styled(SlippageToleranceInputBase)`
  // TODO
`;

export const SlippageToleranceInput = fixHMR(StyledSlippageToleranceInput);
