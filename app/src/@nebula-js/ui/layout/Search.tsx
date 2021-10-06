import { SearchIcon } from '@nebula-js/icons';
import { fixHMR } from 'fix-hmr';
import React, { DetailedHTMLProps, InputHTMLAttributes } from 'react';
import styled from 'styled-components';
import { breakpoints } from '../env';
import { EmptyTextInput } from '../form/EmptyTextInput';

export interface SearchProps
  extends Omit<
    DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
    'ref'
  > {}

function SearchBase({ className, children, ...inputProps }: SearchProps) {
  return (
    <div className={className}>
      <SearchIcon />
      <EmptyTextInput {...inputProps} />
      {children && <div className="end">{children}</div>}
    </div>
  );
}

const StyledSearch = styled(SearchBase)`
  height: 4rem;

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
  }

  .end {
    padding-right: 2rem;
  }

  &:focus-within {
    background-color: var(--color-gray18);
  }

  // mobile
  @media (max-width: ${breakpoints.mobile.max}px) {
    height: 3rem;
  }
`;

export const Search = fixHMR(StyledSearch);
