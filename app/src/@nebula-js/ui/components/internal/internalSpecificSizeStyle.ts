import { css } from 'styled-components';

export const specificSizeStyle = (
  size: number | { width: number; height: number },
) => css`
  width: ${typeof size === 'number' ? size : size.width}px;
  height: ${typeof size === 'number' ? size : size.height}px;

  display: grid;
  place-content: center;
`;
