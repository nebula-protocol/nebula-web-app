import { FormLabel, TextInput } from '@nebula-js/ui';
import { Meta } from '@storybook/react';
import React, { useState } from 'react';

export default {
  title: 'ui/FormLabel',
} as Meta;

export const Basic = () => {
  const [value, setValue] = useState<string>('');

  return (
    <FormLabel label="TEST LABEL">
      <TextInput
        fullWidth
        value={value}
        onChange={({ target }) => setValue(target.value)}
      />
    </FormLabel>
  );
};
