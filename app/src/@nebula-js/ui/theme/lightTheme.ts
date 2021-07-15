import { createTheme } from '@material-ui/core/styles';
import type { DefaultTheme } from 'styled-components';
import { muiThemeBase } from './muiThemeBase';

const muiTheme = createTheme({
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
};
