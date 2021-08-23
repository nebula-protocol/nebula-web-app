import React from 'react';
import { createGlobalStyle } from 'styled-components';
import { GlobalStyle } from '../src/@nebula-js/ui/GlobalStyle';
import { ThemeProvider } from '../src/contexts/theme';
import { Breakpoint, CssRoute, StaticStyleRouter } from '../src/@libs/style-router';
import { theme } from './theme';

const breakpoints: Breakpoint[] = [
  ['small', '<=530'],
  ['medium', '>530 and <=830'],
  ['large', '>830 and <=1440'],
  ['xlarge', '>1440'],
];

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  docs: {
    theme,
  },
  backgrounds: {
    default: 'dark',
    values: [
      {
        name: 'dark',
        value: 'dark',
      },
      {
        name: 'light',
        value: 'light',
      },
    ],
  },
};

export const decorators = [
  (Story, { globals }) => (
    <StaticStyleRouter
      breakpoint="large"
      color={globals?.backgrounds?.value === 'light' ? 'light' : 'dark'}
    >
      <CssRoute
        href={({ color }) =>
          `https://terra-ux.vercel.app/styles/colors/${color}.css`
        }
      />
      <CssRoute
        href={({ breakpoint }) =>
          `https://terra-ux.vercel.app/styles/layouts/${breakpoint}.css`
        }
      />

      <ThemeProvider>
        <GlobalStyle />
        <DocGlobalStyle />
        <Story />
      </ThemeProvider>
    </StaticStyleRouter>
  ),
];

export const DocGlobalStyle = createGlobalStyle`
  .docs-story {
    background-color: ${({ theme }) => theme.backgroundColor};
  }
`;
