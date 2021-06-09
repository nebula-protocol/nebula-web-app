import { css } from 'styled-components';

export const fixedSizeStyle = (size: string) => css`
  min-width: ${size};
  min-height: ${size};
  max-width: ${size};
  max-height: ${size};
`;
