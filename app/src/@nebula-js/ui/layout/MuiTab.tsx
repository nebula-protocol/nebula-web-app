import React, {
  DetailedHTMLProps,
  HTMLAttributes,
  ChangeEvent,
  useMemo,
} from 'react';
import { Tabs, Tab, TabProps } from '@material-ui/core';
import { TabItem } from './Tab';
import { withStyles } from '@material-ui/core/styles';
import styled from 'styled-components';
import { breakpoints } from '../env';

export interface MuiTabProps
  extends Omit<
    DetailedHTMLProps<HTMLAttributes<HTMLUListElement>, HTMLUListElement>,
    'onChange'
  > {
  items: TabItem[];
  selectedItem: TabItem;
  onChange: (nextTab: TabItem) => void;
}

function MuiTabBase({ className, items, selectedItem, onChange }: MuiTabProps) {
  const value = useMemo(() => {
    return items.findIndex((item) => item.id === selectedItem.id);
  }, [selectedItem, items]);

  const handleChange = (_: ChangeEvent<{}>, newValue: string) => {
    const tabIdx = parseInt(newValue);

    if (tabIdx >= items.length) {
      console.error('MuiTab: exceeds item index');
    } else {
      onChange(items[tabIdx]);
    }
  };

  return (
    <Tabs
      value={value}
      onChange={handleChange}
      className={className}
      variant="scrollable"
      TabIndicatorProps={{
        style: {
          backgroundColor: 'var(--color-blue)',
          height: '3px',
          borderBottom: '1px solid var(--color-grey7)',
        },
      }}
    >
      {items.map(({ label, id }) => (
        <StyledTab key={id} label={label} />
      ))}
    </Tabs>
  );
}

const StyledTab = withStyles((theme) => ({
  root: {
    textTransform: 'none',
    color: 'var(--color-white1)',
    fontWeight: 500,
    minWidth: 0,
    fontSize: '16px',
    padding: '16px 0',
    marginRight: '48px',
    [theme.breakpoints.down('md')]: {
      fontSize: '14px',
      marginRight: '36px',
    },
  },
}))((props: TabProps) => <Tab disableRipple {...props} />);

export const MuiTab = styled(MuiTabBase)`
  @media (max-width: ${breakpoints.tablet.max}px) {
    border-bottom: 1px solid var(--color-gray7);
  }
`;
