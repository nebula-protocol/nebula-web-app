import { SearchIcon } from '@nebula-js/icons';
import { fixHMR } from 'fix-hmr';
import React, {
  DetailedHTMLProps,
  InputHTMLAttributes,
  ReactNode,
} from 'react';
import { useMediaQuery } from 'react-responsive';
import styled from 'styled-components';
import { breakpoints } from '../env';
import { EmptyTextInput } from '../form/EmptyTextInput';

export interface SearchProps
  extends Omit<
    DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
    'ref'
  > {
  selectInput?: ReactNode;
}

function SearchBase({
  className,
  children,
  selectInput,
  ...inputProps
}: SearchProps) {
  const isMobile = useMediaQuery({ maxWidth: breakpoints.tablet.max });

  return isMobile ? (
    <div className={className}>
      <div className="search-container">
        <SearchIcon />
        <EmptyTextInput {...inputProps} />
        {children && <div className="end">{children}</div>}
      </div>
      {selectInput}
    </div>
  ) : (
    <div className={className}>
      <div className="search-container">
        <SearchIcon />
        <EmptyTextInput {...inputProps} />
      </div>
      {children && (
        <div className="end">
          {selectInput}
          {children}
        </div>
      )}
    </div>
  );
}

const StyledSearch = styled(SearchBase)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2em;

  .search-container {
    min-width: 0;
    max-width: 370px;
    width: 100%;
    height: 3rem;

    background-color: var(--color-gray14);
    border-radius: 8px;
    padding-left: 2rem;

    display: flex;
    gap: 0.8rem;
    align-items: center;

    > svg {
      color: var(--color-paleblue);

      width: 1.1rem;
      height: 1.1rem;
    }

    input {
      flex: 1;
      align-self: stretch;
      margin-left: 0.6em;
    }

    &:focus-within {
      background-color: var(--color-gray18);
    }

    // mobile
    @media (max-width: ${breakpoints.mobile.max}px) {
      height: 3rem;
    }
  }

  .end {
    display: flex;
    gap: 1em;
  }

  @media (max-width: ${breakpoints.tablet.max}px) {
    flex-direction: column;

    .search-container {
      max-width: 100%;
    }

    .end {
      padding-right: 2rem;
    }
  }
`;

export const Search = fixHMR(StyledSearch);
