import { Slider } from '@material-ui/core';
import { useSliderStyle } from '@nebula-js/ui';
import { Meta } from '@storybook/react';
import React, { ChangeEvent, useState } from 'react';

export default {
  title: 'ui/Slider',
} as Meta;

export const Basic = () => {
  const [value, setValue] = useState<number>(50);

  const sliderClasses = useSliderStyle();

  return (
    <div style={{ width: '60vw', padding: '100px 0' }}>
      <Slider
        classes={sliderClasses}
        value={value}
        min={0}
        max={100}
        onChange={(_: ChangeEvent<{}>, newValue: number | number[]) => {
          if (typeof newValue === 'number') {
            setValue(newValue);
          }
        }}
      />
    </div>
  );
};
