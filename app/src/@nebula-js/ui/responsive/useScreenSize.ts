import { useEffect, useState } from 'react';
import { screen } from '../env';

export type ScreenSize = keyof typeof screen;

export function checkScreenSize(): ScreenSize {
  const width = window.innerWidth;

  if (width >= screen.monitor.min) {
    return 'monitor';
  } else if (width >= screen.pc.min && width <= screen.pc.max) {
    return 'pc';
  } else if (width >= screen.tablet.min && width <= screen.tablet.max) {
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
