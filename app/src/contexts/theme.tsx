import {
  darkTheme,
  lightTheme,
  ThemeProvider as NebulaThemeProvider,
} from '@nebula-js/ui';
import type { ReactNode } from 'react';
import React, {
  Consumer,
  Context,
  createContext,
  useContext,
  useMemo,
} from 'react';
import { useStyle } from 'style-router';
import type { DefaultTheme } from 'styled-components';

export interface ThemeProviderProps {
  children: ReactNode;
}

export interface ThemeState {
  theme: DefaultTheme;
}

// @ts-ignore
const ThemeContext: Context<ThemeState> = createContext<ThemeState>();

export function ThemeProvider({ children }: ThemeProviderProps) {
  const { color } = useStyle();

  const theme = useMemo(() => {
    return color === 'dark' ? darkTheme : lightTheme;
  }, [color]);

  const state = useMemo<ThemeState>(
    () => ({
      theme,
    }),
    [theme],
  );

  return (
    <ThemeContext.Provider value={state}>
      <NebulaThemeProvider theme={theme}>{children}</NebulaThemeProvider>
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeState {
  return useContext(ThemeContext);
}

export const ThemeConsumer: Consumer<ThemeState> = ThemeContext.Consumer;
