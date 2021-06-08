import { createMuiTheme } from '@material-ui/core/styles';
import type { DefaultTheme } from 'styled-components';
import { muiThemeBase } from './muiThemeBase';

const muiTheme = createMuiTheme({
  ...muiThemeBase,

  palette: {
    type: 'light',
  },

  overrides: {
    MuiTouchRipple: {
      root: {
        opacity: 0.15,
      },
    },
  },
});

export const lightTheme: DefaultTheme = {
  ...muiTheme,

  colors: {
    gray08: '#ffffff',
    gray11: '#e8e8e8',
    gray14: '#f5f5f5',
    gray18: '#ffffff',
    gray22: '#f0f0f0',
    gray24: '#eeeeee',
    gray34: '#cccccc',
    white44: '#a4a4a4',
    white52: '#999999',
    white64: '#777777',
    white80: '#3d3d3d',
    white92: '#222222',
    white100: '#000000',

    paleblue: muiTheme.palette.augmentColor({
      main: '#23bed9',
      light: '#4fcbe0',
    }),
  },
};
