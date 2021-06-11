import { css } from 'styled-components';

export const specificSizeStyle = (
  size: number | { width: number; height: number },
) => css`
  width: ${typeof size === 'number' ? size : size.width}px;
  height: ${typeof size === 'number' ? size : size.height}px;
  min-width: ${typeof size === 'number' ? size : size.width}px;
  min-height: ${typeof size === 'number' ? size : size.height}px;
  max-width: ${typeof size === 'number' ? size : size.width}px;
  max-height: ${typeof size === 'number' ? size : size.height}px;

  display: inline-grid;
  place-content: center;
`;
