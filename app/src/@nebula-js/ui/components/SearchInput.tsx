import { SearchIcon } from '@nebula-js/icons';
import { EmptyTextInput } from './EmptyTextInput';
import styled from 'styled-components';
import React, { DetailedHTMLProps, InputHTMLAttributes } from 'react';
import { screen } from '../env';

export interface SearchInputProps
  extends Omit<
    DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
    'ref'
  > {}

function SearchInputBase({ className, ...inputProps }: SearchInputProps) {
  return (
    <div className={className}>
      <SearchIcon />
      <EmptyTextInput {...inputProps} />
    </div>
  );
}

export const SearchInput = styled(SearchInputBase)`
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
