import { useScreenSize } from './useScreenSize';

export function useScreenSizeValue<T>(values: {
  mobile: T;
  tablet: T;
  pc: T;
  monitor: T;
}): T {
  const size = useScreenSize();
  return values[size];
}
