import React, { DetailedHTMLProps, HTMLAttributes } from 'react';
import styled, { css } from 'styled-components';
import { TabItem, tabStyle } from './Tab';

export interface TabSectionProps
  extends Omit<
    DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>,
    'onChange'
  > {
  items: TabItem[];
  selectedItem: TabItem;
  onChange: (nextTab: TabItem) => void;
  emptyMain?: boolean;
}

function TabSectionBase({
  items,
  selectedItem,
  onChange,
  children,
  emptyMain,
  ...sectionProps
}: TabSectionProps) {
  return (
    <section {...sectionProps}>
      <div className="TabSection-main">{children}</div>
      <ul role="tablist">
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
    </section>
  );
}

const mainStyle = css`
  background-color: var(--color-gray4);
  color: var(--color-white2);

  padding: 2.85rem 2.3rem;

  h1 {
    font-size: 2rem;
  }
`;

export const TabSection = styled(TabSectionBase)`
  .TabSection-main {
    border-radius: 8px 8px 0 0;

    ${({ emptyMain = false }) => (emptyMain ? '' : mainStyle)};

    margin-bottom: 1px;
  }

  ul[role='tablist'] {
    ${tabStyle};

    font-size: 12px;
    height: 3.3em;

    > li {
      &:first-child {
        border-bottom-left-radius: 8px;
      }

      &:last-child {
        border-bottom-right-radius: 8px;
      }
    }
  }
`;
