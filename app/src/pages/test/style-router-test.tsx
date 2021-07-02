import { Button } from '@nebula-js/ui';
import { ImportCss, StyleRoute, useCssVariable, useStyle } from 'style-router';
import { MainLayout } from 'components/layouts/MainLayout';
import { fixHMR } from 'fix-hmr';
import React from 'react';
import styled, { createGlobalStyle } from 'styled-components';

export interface StyleRouterTestProps {
  className?: string;
}

function StyleRouterTestBase({ className }: StyleRouterTestProps) {
  const { color, updateColor, breakpoint } = useStyle();
  const paleblue = useCssVariable('--color-paleblue');
  const white100 = useCssVariable('--color-white100');

  return (
    <MainLayout className={className}>
      <section>
        <div style={{ color: paleblue }}>paleblue: {paleblue}</div>
        <div>white100: {white100}</div>
      </section>

      <section style={{ marginTop: 40 }}>
        <div>current: {color}</div>

        <StyleRoute matchColor="dark">
          <ImportCss href="/styles/colors/dark.css" />
          <GlobalStyleDark />
          <p>color: dark</p>
        </StyleRoute>

        <StyleRoute matchColor="light">
          <ImportCss href="/styles/colors/light.css" />
          <GlobalStyleLight />
          <p>color: light</p>
        </StyleRoute>

        <footer style={{ marginTop: 20 }}>
          <Button
            size="small"
            onClick={() => updateColor(color === 'dark' ? 'light' : 'dark')}
          >
            Change color (current: {color})
          </Button>
        </footer>
      </section>

      <section style={{ marginTop: 40 }}>
        <div>current: {breakpoint}</div>

        <StyleRoute matchBreakpoint="small">
          <ImportCss href="/styles/layouts/small.css" />
          <p>breakpoint: small</p>
        </StyleRoute>

        <StyleRoute matchBreakpoint="medium">
          <ImportCss href="/styles/layouts/medium.css" />
          <p>breakpoint: medium</p>
        </StyleRoute>

        <StyleRoute matchBreakpoint="large">
          <ImportCss href="/styles/layouts/large.css" />
          <p>breakpoint: large</p>
        </StyleRoute>

        <StyleRoute matchBreakpoint="xlarge">
          <ImportCss href="/styles/layouts/xlarge.css" />
          <p>breakpoint: xlarge</p>
        </StyleRoute>
      </section>
    </MainLayout>
  );
}

const GlobalStyleDark = createGlobalStyle`
  p {
    text-decoration: underline;
  }
`;

const GlobalStyleLight = createGlobalStyle`
  p {
    text-decoration: line-through;
  }
`;

export const StyledStyleRouterTest = styled(StyleRouterTestBase)`
  p {
    color: var(--text-color);
    font-size: var(--font-size);
  }
`;

export const StyleRouterTest = fixHMR(StyledStyleRouterTest);
