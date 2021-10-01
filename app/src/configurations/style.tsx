import { Breakpoint, CssRoute, StyleRouter } from '@libs/style-router';
import { GlobalStyle } from '@nebula-js/ui';
import { ThemeProvider } from 'contexts/theme';
import React, { ReactNode } from 'react';

const breakpoints: Breakpoint[] = [
  ['small', '<=530'],
  ['medium', '>530 and <=830'],
  ['large', '>830 and <=1440'],
  ['xlarge', '>1440'],
];

export function StyleProviders({ children }: { children: ReactNode }) {
  return (
    <StyleRouter
      defaultColor="dark"
      breakpoints={breakpoints}
      fallbackBreakpoint="large"
    >
      <CssRoute
        href={({ color }) => `/styles/colors/${color}.css`}
        selector="#theme-color"
      />
      <CssRoute
        href={({ breakpoint }) => `/styles/layouts/${breakpoint}.css`}
      />

      <ThemeProvider>
        <GlobalStyle />
        {children}
      </ThemeProvider>
    </StyleRouter>
  );
}
