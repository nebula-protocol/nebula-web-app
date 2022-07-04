import { Slider as MuiSlider } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import thumbImage from './assets/SliderArrow.svg';

export const Slider = withStyles({
  root: {
    color: 'var(--color-gray7)',
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
  mark: {
    width: 1,
    height: 10,
    transform: 'translate(-0.5px, -10px)',
    opacity: 0.7,
  },
  markLabel: ({ marks = [] }: any) => ({
    'fontSize': 11,
    '--mark-y': 'var(--slider-mark-y, -40px)',
    'transform': `translateY(var(--mark-y))`,
    '&[data-index="0"]': {
      transform: `translate(0, var(--mark-y))`,
    },
    [`&[data-index="${marks.length - 1}"]`]: {
      transform: `translate(-100%, var(--mark-y))`,
    },
  }),
  track: {
    height: 8,
    borderRadius: 0,
    backgroundColor: 'var(--color-paleblue)',
  },
  rail: {
    height: 8,
    borderRadius: 0,
    opacity: 1,
  },
})(MuiSlider);
