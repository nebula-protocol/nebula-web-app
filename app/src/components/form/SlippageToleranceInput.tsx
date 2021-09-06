import { Percent, Rate } from '@libs/types';
import {
  EmptyNumberInput,
  SwitchInput,
  SwitchInputProps,
  SwitchItem,
} from '@nebula-js/ui';
import big from 'big.js';
import { fixHMR } from 'fix-hmr';
import React from 'react';
import styled from 'styled-components';

export interface SlippageToleranceInputProps
  extends Omit<SwitchInputProps<Rate>, 'items' | 'children'> {
  className?: string;
}

const slippages: SwitchItem<Rate>[] = [
  { label: '0.1%', value: '0.001' as Rate },
  { label: '0.5%', value: '0.005' as Rate },
  { label: '1%', value: '0.01' as Rate },
  { label: '5%', value: '0.05' as Rate },
];

function SlippageToleranceInputBase(props: SlippageToleranceInputProps) {
  return (
    <SwitchInput {...props} items={slippages}>
      {(input) => (
        <EmptyNumberInput<Percent>
          autoFocus
          value={big(input.value).mul(100).toFixed() as Percent}
          onChange={(percent) =>
            input.onChange(big(percent).div(100).toFixed() as Rate)
          }
          type="integer"
          maxIntegerPoints={2}
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
