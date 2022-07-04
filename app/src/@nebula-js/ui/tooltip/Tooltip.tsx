import { makeStyles } from '@material-ui/core/styles';
import MuiTooltip, {
  TooltipProps as MuiTooltipProps,
} from '@material-ui/core/Tooltip';
import React from 'react';
import { NebulaTheme } from '../theme/Theme';

export interface TooltipProps extends MuiTooltipProps {}

/**
 * Styled component of the `<Tooltip/>` of the Material-UI
 *
 * @see https://material-ui.com/api/tooltip/
 */
export function Tooltip({ arrow = true, ...props }: TooltipProps) {
  const classes = useTooltipStyle(props);

  return <MuiTooltip classes={classes} arrow={arrow} {...props} />;
}

export const useTooltipStyle = makeStyles<NebulaTheme, TooltipProps>(
  (theme) => ({
    tooltip: {
      position: 'relative',
      borderRadius: 4,
      color: 'var(--color-gray6)',
      backgroundColor: 'var(--color-white4)',
      fontSize: '12px',
      fontWeight: 400,
      padding: '8px 12px',
      boxShadow: '1px 3px 6px 0px rgba(0,0,0,0.2)',
    },
    arrow: {
      color: 'var(--color-white4)',
    },
  }),
);
