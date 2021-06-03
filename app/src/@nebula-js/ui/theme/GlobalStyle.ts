import { createGlobalStyle, css } from 'styled-components';
import { NebulaTheme } from './Theme';

function bodyStyleIfThemeExists(theme?: NebulaTheme): string {
  if (!theme) return '';

  const styles = [];

  if (theme?.colors) {
    styles.push(`background-color: ${theme.colors.gray11};`);
    styles.push(`color: ${theme.colors.white80};`);
  }

  return `body { ${styles.join('')} }`;
}

export const globalStyle = css`
  html,
  body {
    margin: 0;
  }

  ${({ theme }) => bodyStyleIfThemeExists(theme)};

  html {
    font-family: Gotham, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    font-size: 16px;
    word-spacing: 1px;
    -ms-text-size-adjust: 100%;
    -webkit-text-size-adjust: 100%;
    box-sizing: border-box;
  }

  *,
  *::before,
  *::after {
    box-sizing: border-box;
    margin: 0;
    font-family: Gotham, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
  }

  ::-webkit-scrollbar {
    display: none;
  }

  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type='number'] {
    -moz-appearance: textfield;
  }
`;

export const GlobalStyle = createGlobalStyle`
  ${globalStyle}
`;
