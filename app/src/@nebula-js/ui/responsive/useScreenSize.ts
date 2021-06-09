import { useEffect, useState } from 'react';
import { breakpoints } from '../env';

export type ScreenSize = keyof typeof breakpoints;

export function checkScreenSize(): ScreenSize {
  const width = window.innerWidth;

  if (width >= breakpoints.monitor.min) {
    return 'monitor';
  } else if (width >= breakpoints.pc.min && width <= breakpoints.pc.max) {
    return 'pc';
  } else if (
    width >= breakpoints.tablet.min &&
    width <= breakpoints.tablet.max
  ) {
    return 'tablet';
  }
  return 'mobile';
}

export function useScreenSize() {
  const [value, setValue] = useState<ScreenSize>(() => checkScreenSize());

  useEffect(() => {
    function callback() {
      const nextValue = checkScreenSize();
      setValue(nextValue);
    }

    window.addEventListener('resize', callback);

    return () => {
      window.removeEventListener('resize', callback);
    };
  }, []);

  return value;
}
