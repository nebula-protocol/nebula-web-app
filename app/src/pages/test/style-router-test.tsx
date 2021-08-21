import { Button } from '@nebula-js/ui';
import { MainLayout } from 'components/layouts/MainLayout';
import { fixHMR } from 'fix-hmr';
import React from 'react';
import { StyleRoute, useCssVariable, useStyle } from '@packages/style-router';
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
          <GlobalStyleDark />
          <p>color: dark</p>
        </StyleRoute>

        <StyleRoute matchColor="light">
          <GlobalStyleLight />
          <p>color: light</p>
        </StyleRoute>

        <footer style={{ marginTop: 20 }}>
          <Button
            size="small"
            onClick={() =>
              updateColor((prevColor) =>
                prevColor === 'dark' ? 'light' : 'dark',
              )
            }
          >
            Change color (current: {color})
          </Button>
        </footer>
      </section>

      <section style={{ marginTop: 40 }}>
        <div>current: {breakpoint}</div>

        <StyleRoute matchBreakpoint="small">
          <p>breakpoint: small</p>
        </StyleRoute>

        <StyleRoute matchBreakpoint="medium">
          <p>breakpoint: medium</p>
        </StyleRoute>

        <StyleRoute matchBreakpoint="large">
          <p>breakpoint: large</p>
        </StyleRoute>

        <StyleRoute matchBreakpoint="xlarge">
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
