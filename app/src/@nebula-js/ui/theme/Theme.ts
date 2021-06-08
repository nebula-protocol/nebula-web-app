import type { Theme } from '@material-ui/core';
import type { PaletteColor } from '@material-ui/core/styles/createPalette';

export interface NebulaTheme extends Theme {
  colors: {
    gray08: string;
    gray11: string;
    gray14: string;
    gray18: string;
    gray22: string;
    gray24: string;
    gray34: string;
    white44: string;
    white52: string;
    white64: string;
    white80: string;
    white92: string;
    white100: string;

    paleblue: PaletteColor;
  };
}
