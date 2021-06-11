import { EmptyTextInput } from '@nebula-js/ui';
import { Meta } from '@storybook/react';
import React, { useState } from 'react';

export default {
  title: 'ui/EmptyTextInput',
} as Meta;

export const Basic = () => {
  const [value, setValue] = useState<string>('');

  return (
    <EmptyTextInput
      value={value}
      onChange={({ target }) => setValue(target.value)}
    />
  );
};

export const Styling = () => {
  const [value, setValue] = useState<string>('');

  return (
    <EmptyTextInput
      value={value}
      onChange={({ target }) => setValue(target.value)}
      style={{
        backgroundColor: 'blue',
        width: '100%',
        height: 100,
        padding: '0 10px',
        fontSize: 30,
      }}
    />
  );
};
