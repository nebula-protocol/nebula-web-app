import { Slider as MuiSlider } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import { DefaultTheme } from 'styled-components';
import thumbImage from './assets/SliderArrow.svg';

export const Slider = withStyles((_theme: any) => {
  const theme: DefaultTheme = _theme;

  return {
    root: {
      color: theme.colors.gray34,
      height: 8,
    },
    thumb: {
      'height': 20,
      'width': 20,
      'backgroundImage': `url(${thumbImage})`,
      'backgroundRepeat': 'no-repeat',
      'backgroundPosition': 'center',
      'backgroundColor': 'white',
      'border': '1px solid black',
      'marginTop': -6,
      'marginLeft': -9,
      '&:focus, &:hover, &$active': {
        boxShadow: 'inherit',
      },
    },
    active: {},
    track: {
      height: 8,
      borderRadius: 0,
      backgroundColor: theme.colors.paleblue.main,
    },
    rail: {
      height: 8,
      borderRadius: 0,
      opacity: 1,
    },
  };
})(MuiSlider);
