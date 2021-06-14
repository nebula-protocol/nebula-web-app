import styled from 'styled-components';

export const FeeBox = styled.ul`
  list-style: none;
  margin: 0;

  background-color: ${({ theme }) => theme.colors.gray14};
  color: ${({ theme }) => theme.colors.white80};
  border-radius: 8px;

  font-weight: 300;

  padding: 1.4em 1.7em;

  > li {
    display: flex;
    align-items: center;
    justify-content: space-between;

    > :first-child {
      color: ${({ theme }) => theme.colors.white44};
    }

    &:not(:first-child) {
      margin-top: 0.5em;
    }
  }
`;
