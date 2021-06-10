import React from 'react';
import { createGlobalStyle } from 'styled-components';
import { GlobalStyle } from '../src/@nebula-js/ui/GlobalStyle';
import { darkTheme } from '../src/@nebula-js/ui/theme/darkTheme';
import { lightTheme } from '../src/@nebula-js/ui/theme/lightTheme';
import { ThemeProvider } from '../src/@nebula-js/ui/theme/ThemeProvider';
import { theme } from './theme';

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
        value: darkTheme.colors.gray11,
      },
      {
        name: 'light',
        value: lightTheme.colors.gray11,
      },
    ],
  },
};

export const decorators = [
  (Story, { globals }) => (
    <ThemeProvider
      theme={
        globals?.backgrounds?.value === darkTheme.backgroundColor
          ? darkTheme
          : lightTheme
      }
    >
      <GlobalStyle />
      <DocGlobalStyle />
      <Story />
    </ThemeProvider>
  ),
];

export const DocGlobalStyle = createGlobalStyle`
  .docs-story {
    background-color: ${({ theme }) => theme.backgroundColor};
  }
`;
