import { matchSizeQuery } from '@packages/size-query';
import React, {
  Consumer,
  Context,
  createContext,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

export type Breakpoint = [key: string, query: string];

export interface StyleRouterProps {
  children: ReactNode;
  defaultColor: string;
  breakpoints: Breakpoint[];
  fallbackBreakpoint: string;
}

export interface StyleRouterState {
  color: string;
  breakpoint: string;
  updateColor: (nextColor: SetStateAction<string>) => void;
}

export const StyleRouterContext: Context<StyleRouterState> =
  // @ts-ignore
  createContext<StyleRouterState>();

function findBreakpoint(
  width: number,
  breakpoints: Breakpoint[],
  fallbackBreakpoint: string,
): string {
  const breakpoint = breakpoints.find(([, query]) =>
    matchSizeQuery(width, query),
  );
  return breakpoint?.[0] ?? fallbackBreakpoint;
}

const COLOR_KEY = '__style-router_color__';

export function StyleRouter({
  children,
  defaultColor,
  fallbackBreakpoint,
  breakpoints,
}: StyleRouterProps) {
  const [color, setColor] = useState<string>(
    () => localStorage.getItem(COLOR_KEY) ?? defaultColor,
  );
  const [breakpoint, setBreakpoint] = useState<string>(() =>
    findBreakpoint(window.innerWidth, breakpoints, fallbackBreakpoint),
  );

  const initialBreakpoints = useRef(breakpoints);
  const initialFallbackBreakpoint = useRef(fallbackBreakpoint);

  const updateColor = useCallback((nextColor: SetStateAction<string>) => {
    setColor((prevColor) => {
      const c =
        typeof nextColor === 'function' ? nextColor(prevColor) : nextColor;
      localStorage.setItem(COLOR_KEY, c);
      return c;
    });
  }, []);

  const state = useMemo<StyleRouterState>(
    () => ({ color, breakpoint, updateColor }),
    [breakpoint, color, updateColor],
  );

  useEffect(() => {
    function callback() {
      const nextBreakpoint = findBreakpoint(
        window.innerWidth,
        initialBreakpoints.current,
        initialFallbackBreakpoint.current,
      );
      setBreakpoint(nextBreakpoint);
    }

    window.addEventListener('resize', callback);

    return () => {
      window.removeEventListener('resize', callback);
    };
  }, []);

  return (
    <StyleRouterContext.Provider value={state}>
      {children}
    </StyleRouterContext.Provider>
  );
}

export function useStyle(): StyleRouterState {
  return useContext(StyleRouterContext);
}

export const StyleConsumer: Consumer<StyleRouterState> =
  StyleRouterContext.Consumer;
