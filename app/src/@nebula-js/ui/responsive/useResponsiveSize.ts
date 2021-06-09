import { useMediaQuery } from 'react-responsive';

export function useResponsiveSize<T extends string>(
  size: T,
  smallScreenSize: T,
): T {
  const isSmallScreen = useMediaQuery({ maxWidth: 700 });
  return isSmallScreen ? smallScreenSize : size;
}
