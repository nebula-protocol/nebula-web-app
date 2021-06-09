import { SearchIcon } from '@nebula-js/icons';
import React, { DetailedHTMLProps, InputHTMLAttributes } from 'react';
import styled from 'styled-components';
import { screen } from '../env';
import { EmptyTextInput } from '../form/EmptyTextInput';

export interface SearchProps
  extends Omit<
    DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
    'ref'
  > {}

function SearchBase({ className, ...inputProps }: SearchProps) {
  return (
    <div className={className}>
      <SearchIcon />
      <EmptyTextInput {...inputProps} />
    </div>
  );
}

export const Search = styled(SearchBase)`
  height: 4rem;

  background-color: ${({ theme }) => theme.colors.gray14};
  border-radius: 8px;
  padding-left: 2.3rem;

  display: flex;
  gap: 0.8rem;
  align-items: center;

  svg {
    width: 1.1rem;
    height: 1.1rem;
  }

  input {
    flex: 1;
    align-self: stretch;
  }

  // mobile
  @media (max-width: ${screen.mobile.max}px) {
    height: 3rem;
    padding-left: 1.7rem;
  }
`;
