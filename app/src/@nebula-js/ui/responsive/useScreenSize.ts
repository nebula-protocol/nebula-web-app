import { useEffect, useState } from 'react';
import { breakpoints } from '../env';

export type ScreenSize = keyof typeof breakpoints;

export function checkScreenSize(): [ScreenSize, number] {
  const width = window.innerWidth;

  if (width >= breakpoints.monitor.min) {
    return ['monitor', width];
  } else if (width >= breakpoints.pc.min && width <= breakpoints.pc.max) {
    return ['pc', width];
  } else if (
    width >= breakpoints.tablet.min &&
    width <= breakpoints.tablet.max
  ) {
    return ['tablet', width];
  }
  return ['mobile', width];
}

export function useScreenSize(): [ScreenSize, number] {
  const [[value, width], setValue] = useState<[ScreenSize, number]>(() =>
    checkScreenSize(),
  );

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

  return [value, width];
}
