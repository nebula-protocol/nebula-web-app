import React, { DetailedHTMLProps, HTMLAttributes } from 'react';
import styled, { css } from 'styled-components';
import { TabItem } from './Tab';

export interface SubTabProps
  extends Omit<
    DetailedHTMLProps<HTMLAttributes<HTMLUListElement>, HTMLUListElement>,
    'onChange'
  > {
  items: TabItem[];
  selectedItem: TabItem;
  onChange: (nextTab: TabItem) => void;
}

function SubTabBase({
  items,
  selectedItem,
  onChange,
  ...ulProps
}: SubTabProps) {
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

export const subTabStyle = css`
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

    text-align: center;

    background-color: var(--color-gray6);
    color: var(--color-white3);

    transition: background-color 0.3s ease-out, color 0.3s ease-out;

    &:hover {
      background-color: var(--color-gray7);
      color: var(--color-white1);
    }

    &[aria-selected='true'] {
      background-color: var(--color-paleblue);
      color: var(--color-gray100);
    }
  }
`;

export const SubTab = styled(SubTabBase)`
  ${subTabStyle};

  font-size: 12px;
  height: 2.5em;

  > li {
    &:first-child {
      border-top-left-radius: 100px;
      border-bottom-left-radius: 100px;
    }

    &:last-child {
      border-top-right-radius: 100px;
      border-bottom-right-radius: 100px;
    }
  }
`;
