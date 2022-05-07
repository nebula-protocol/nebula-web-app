import { darkTheme, ThemeProvider, breakpoints } from '@nebula-js/ui';
import React from 'react';
import { useMediaQuery } from 'react-responsive';
import { DesktopHeader } from './desktop';
import { MobileHeader } from './mobile';
import { TestnetWarning } from './TestnetWarning';

export function Header() {
  const isMobile = useMediaQuery({ maxWidth: breakpoints.tablet.max });

  return (
    <ThemeProvider theme={darkTheme} injectFirst={false}>
      <TestnetWarning />
      {isMobile ? <MobileHeader /> : <DesktopHeader />}
    </ThemeProvider>
  );
}
