import React, { DetailedHTMLProps, HTMLAttributes, ReactNode } from 'react';
import styled, { css } from 'styled-components';
import { breakpoints } from '../env';

export interface TabItem {
  id: string;
  label: ReactNode;
}

export interface TabProps
  extends Omit<
    DetailedHTMLProps<HTMLAttributes<HTMLUListElement>, HTMLUListElement>,
    'onChange'
  > {
  items: TabItem[];
  selectedItem: TabItem;
  onChange: (nextTab: TabItem) => void;
}

function TabBase({ items, selectedItem, onChange, ...ulProps }: TabProps) {
  return (
    <ul {...ulProps} role="tablist">
      {items.map((item) => (
        <li
          key={item.id}
          role="tab"
          aria-selected={selectedItem.id === item.id}
          onClick={() => onChange(item)}
        >
          {item.label}
        </li>
      ))}
    </ul>
  );
}

export const tabStyle = css`
  margin: 0;
  padding: 0;
  list-style: none;

  display: flex;
  gap: 1px;

  > li {
    flex: 1;

    cursor: pointer;
    user-select: none;

    display: grid;
    place-content: center;

    font-size: 1em;

    background-color: ${({ theme }) => theme.colors.gray14};
    color: ${({ theme }) => theme.colors.white44};

    transition: background-color 0.3s ease-out, color 0.3s ease-out;

    &:hover {
      color: ${({ theme }) => theme.colors.white64};
    }

    &[aria-selected='true'] {
      background-color: ${({ theme }) => theme.colors.gray18};
      color: ${({ theme }) => theme.colors.white80};
    }
  }
`;

export const Tab = styled(TabBase)`
  ${tabStyle};

  font-size: 14px;
  height: 4rem;

  > li {
    &:first-child {
      border-top-left-radius: 8px;
      border-bottom-left-radius: 8px;
    }

    &:last-child {
      border-top-right-radius: 8px;
      border-bottom-right-radius: 8px;
    }
  }

  // small layout
  @media (max-width: ${breakpoints.mobile.max}px) {
    height: 3.7rem;
  }
`;
