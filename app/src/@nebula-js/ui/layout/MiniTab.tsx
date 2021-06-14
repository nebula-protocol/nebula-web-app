import React, { DetailedHTMLProps, HTMLAttributes } from 'react';
import styled, { css } from 'styled-components';
import { TabItem } from './Tab';

export interface MiniTabProps
  extends Omit<
    DetailedHTMLProps<HTMLAttributes<HTMLUListElement>, HTMLUListElement>,
    'onChange'
  > {
  items: TabItem[];
  selectedItem: TabItem;
  onChange: (nextTab: TabItem) => void;
}

function MiniTabBase({
  items,
  selectedItem,
  onChange,
  ...ulProps
}: MiniTabProps) {
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

export const miniTabStyle = css`
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
      background-color: ${({ theme }) => theme.colors.white80};
      color: ${({ theme }) => theme.colors.gray14};
    }
  }
`;

export const MiniTab = styled(MiniTabBase)`
  ${miniTabStyle};

  font-size: 12px;
  height: 20px;

  > li {
    &:first-child {
      border-top-left-radius: 4px;
      border-bottom-left-radius: 4px;
    }

    &:last-child {
      border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;
    }
  }
`;
