import { GlobalStyle } from '@nebula-js/ui';
import { ThemeProvider } from 'contexts/theme';
import React, { ReactNode } from 'react';
import { Breakpoint, ImportCss, StyleRoute, StyleRouter } from 'style-router';

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
      <StyleRoute matchColor="dark">
        <ImportCss href="/styles/colors/dark.css" />
      </StyleRoute>
      <StyleRoute matchColor="light">
        <ImportCss href="/styles/colors/light.css" />
      </StyleRoute>

      <StyleRoute matchBreakpoint="small">
        <ImportCss href="/styles/layouts/small.css" />
      </StyleRoute>

      <StyleRoute matchBreakpoint="medium">
        <ImportCss href="/styles/layouts/medium.css" />
      </StyleRoute>

      <StyleRoute matchBreakpoint="large">
        <ImportCss href="/styles/layouts/large.css" />
      </StyleRoute>

      <StyleRoute matchBreakpoint="xlarge">
        <ImportCss href="/styles/layouts/xlarge.css" />
      </StyleRoute>

      <ThemeProvider>
        <GlobalStyle />
        {children}
      </ThemeProvider>
    </StyleRouter>
  );
}
