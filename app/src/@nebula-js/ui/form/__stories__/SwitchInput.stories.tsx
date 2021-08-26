import { Rate } from '@libs/types';
import { Meta } from '@storybook/react';
import React, { useCallback, useMemo, useState } from 'react';
import { EmptyNumberInput } from '../EmptyNumberInput';
import { FormLabel } from '../FormLabel';
import { SwitchInput } from '../SwitchInput';

export default {
  title: 'ui/SwitchInput',
} as Meta;

export const Basic = () => {
  const items = useMemo(() => {
    return [
      { label: '0.1%', value: '0.1' as Rate },
      { label: '0.5%', value: '0.5' as Rate },
      { label: '1%', value: '1' as Rate },
    ];
  }, []);

  const [value, setValue] = useState<Rate>('2.1' as Rate);

  const onChange = useCallback((nextValue: Rate) => {
    setValue(nextValue);
  }, []);

  return (
    <div>
      <FormLabel label="TEST LABEL">
        <SwitchInput<Rate>
          items={items}
          value={value}
          initialCustomValue={'5' as Rate}
          onChange={onChange}
        >
          {(input) => (
            <EmptyNumberInput<Rate>
              value={input.value}
              onChange={input.onChange}
              type="decimal"
              maxDecimalPoints={2}
              maxIntegerPoints={1}
              placeholder="0.00"
            />
          )}
        </SwitchInput>
      </FormLabel>

      <footer>{value}</footer>
    </div>
  );
};
