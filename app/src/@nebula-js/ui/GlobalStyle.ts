import { createGlobalStyle, css } from 'styled-components';
import { breakpoints } from './env';

export const globalStyle = css`
  html,
  body {
    margin: 0;
  }

  body {
    background-color: var(--color-gray11);
    color: var(--color-white80);
  }

  html {
    font-family: var(--font-family);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
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
    font-family: var(--font-family);
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

export const vars = css`
  html {
    font-size: 14px;
  }

  :root {
    --font-size32: 32px;
    --font-size28: 28px;
    --font-size24: 24px;
    --font-size20: 20px;
    --font-size18: 18px;
    --font-size18-16: 18px;
    --font-size16: 16px;
    --font-size16-14: 16px;
    --font-size14: 14px;
    --font-size14-12: 14px;
    --font-size12: 12px;
  }

  @media (max-width: ${breakpoints.tablet.max}px) {
    html {
      font-size: 12px;
    }

    :root {
      --font-size32: 24px;
      --font-size28: 20px;
      --font-size24: 20px;
      --font-size20: 16px;
      --font-size18: 18px;
      --font-size18-16: 16px;
      --font-size16: 16px;
      --font-size16-14: 14px;
      --font-size14: 14px;
      --font-size14-12: 12px;
      --font-size12: 12px;
    }
  }
`;

export const GlobalStyle = createGlobalStyle`
  ${globalStyle}
  ${vars}
`;
