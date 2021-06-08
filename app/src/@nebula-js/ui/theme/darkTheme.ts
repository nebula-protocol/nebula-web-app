import { createMuiTheme } from '@material-ui/core/styles';
import type { DefaultTheme } from 'styled-components';
import { muiThemeBase } from './muiThemeBase';

const muiTheme = createMuiTheme({
  ...muiThemeBase,

  palette: {
    type: 'dark',
  },

  overrides: {
    MuiTouchRipple: {
      root: {
        opacity: 0.15,
      },
    },
  },
});

export const darkTheme: DefaultTheme = {
  ...muiTheme,

  colors: {
    gray08: '#0c0c0c',
    gray11: '#161616',
    gray14: '#222222',
    gray18: '#2d2d2e',
    gray22: '#373738',
    gray24: '#3d3d3d',
    gray34: '#555557',
    white44: '#707070',
    white52: '#858585',
    white64: '#a4a4a4',
    white80: '#cccccc',
    white92: '#ebebeb',
    white100: '#ffffff',

    paleblue: muiTheme.palette.augmentColor({
      main: '#23bed9',
      light: '#4fcbe0',
      contrastText: '#ffffff',
    }),
  },
};
