import { isTouchDevice } from '@libs/is-touch-device';
import { ClickAwayListener } from '@material-ui/core';
import { InfoOutlined } from '@material-ui/icons';
import React, {
  ReactElement,
  ReactNode,
  useCallback,
  useMemo,
  useState,
} from 'react';
import styled from 'styled-components';
import { Tooltip, TooltipProps } from './Tooltip';

export interface InfoTooltipProps
  extends Omit<TooltipProps, 'children' | 'title'> {
  children: NonNullable<ReactNode>;
  icon?: ReactElement;
}

export function InfoTooltip(props: InfoTooltipProps) {
  const touchDevice = useMemo(() => isTouchDevice(), []);

  return touchDevice ? (
    <TouchTooltip {...props} />
  ) : (
    <PointerTooltip {...props} />
  );
}

export function PointerTooltip({
  children,
  placement = 'top',
  icon = <InfoIcon />,
  ...tooltipProps
}: InfoTooltipProps) {
  return (
    <Sup style={{ cursor: 'help' }}>
      <Tooltip {...tooltipProps} title={children} placement={placement}>
        {icon}
      </Tooltip>
    </Sup>
  );
}

export function TouchTooltip({
  children,
  placement = 'top',
  icon = <InfoIcon />,
  ...tooltipProps
}: InfoTooltipProps) {
  const [open, setOpen] = useState<boolean>(false);

  const tooltipOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const tooltipClose = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <ClickAwayListener onClickAway={tooltipClose}>
      <Sup onClick={tooltipOpen}>
        <Tooltip
          {...tooltipProps}
          open={open}
          onClose={tooltipClose}
          disableFocusListener
          disableHoverListener
          disableTouchListener
          title={children}
          placement={placement}
        >
          {icon}
        </Tooltip>
      </Sup>
    </ClickAwayListener>
  );
}

const Sup = styled.sup`
  display: inline-block;
  vertical-align: text-top;
  transform: translateY(-0.2em);
`;

const InfoIcon = styled(InfoOutlined)`
  font-size: 12px;
  opacity: 0.5;

  &:hover {
    opacity: 1;
  }
`;
