import { ReactNode, useMemo } from 'react';
import { useStyle } from './StyleRouter';

export interface StyleRouteProps {
  children: ReactNode;
  matchColor?: string | string[];
  matchBreakpoint?: string | string[];
}

export function StyleRoute({
  children,
  matchColor,
  matchBreakpoint,
}: StyleRouteProps) {
  const { color, breakpoint } = useStyle();

  const matchColors = useMemo<string[]>(() => {
    return Array.isArray(matchColor)
      ? matchColor
      : matchColor
      ? [matchColor]
      : [];
  }, [matchColor]);

  const matchBreakpoints = useMemo<string[]>(() => {
    return Array.isArray(matchBreakpoint)
      ? matchBreakpoint
      : matchBreakpoint
      ? [matchBreakpoint]
      : [];
  }, [matchBreakpoint]);

  const match = useMemo(() => {
    if (matchColors.length === 0 && matchBreakpoints.length === 0) {
      throw new Error(`Either matchColor or matchBreakpoint must be entered`);
    }

    return matchColors.includes(color) || matchBreakpoints.includes(breakpoint);
  }, [breakpoint, color, matchBreakpoints, matchColors]);

  return match ? (children as JSX.Element) : null;
}
