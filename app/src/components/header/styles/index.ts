import { css } from 'styled-components';

export const dropdownContainerStyle = css`
  padding: 28px 24px;
  background-color: ${({ theme }) => theme.colors.gray14};

  border-radius: 8px;
  box-shadow: 0 10px 20px 0 rgba(0, 0, 0, 0.15);

  margin-top: 8px;
`;
