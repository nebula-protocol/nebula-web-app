import { createGlobalStyle } from 'styled-components';

export const StorybookBackgroundColor = createGlobalStyle<{
  backgroundColor?: string;
}>`
  .sb-show-main.sb-main-padded {
    background-color: ${({ backgroundColor }) =>
      backgroundColor ?? 'var(--color-gray2)'} !important;
  }
`;
