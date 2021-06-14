import { useScreenSize } from './useScreenSize';

export function useScreenSizeValue<T>(values: {
  mobile: T;
  tablet: T;
  pc: T;
  monitor: T;
  hook?: (width: number) => T | null | undefined;
}): T {
  const [size, width] = useScreenSize();
  return values.hook?.(width) ?? values[size];
}
