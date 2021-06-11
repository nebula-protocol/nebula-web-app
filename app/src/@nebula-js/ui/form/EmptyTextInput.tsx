import styled from 'styled-components';

export const EmptyTextInput = styled.input`
  border: 0;
  background-color: transparent;
  outline: none;
  padding: 0;

  color: ${({ theme }) => theme.colors.white92};
`;