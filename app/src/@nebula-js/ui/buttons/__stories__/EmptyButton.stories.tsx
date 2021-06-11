import { EmptyButton } from '@nebula-js/ui';
import { Meta } from '@storybook/react';
import React from 'react';

export default {
  title: 'ui/EmptyButton',
} as Meta;

export const Basic = () => {
  return <EmptyButton size={100}>Hello</EmptyButton>;
};
