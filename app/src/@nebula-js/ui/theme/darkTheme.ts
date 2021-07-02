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
};
