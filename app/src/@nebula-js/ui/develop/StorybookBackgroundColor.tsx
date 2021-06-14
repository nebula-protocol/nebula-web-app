import { createGlobalStyle } from 'styled-components';

export const StorybookBackgroundColor = createGlobalStyle<{
  backgroundColor?: string;
}>`
  .sb-show-main.sb-main-padded {
    background-color: ${({ theme, backgroundColor }) =>
      backgroundColor ?? theme.colors.gray11} !important;
  }
`;
