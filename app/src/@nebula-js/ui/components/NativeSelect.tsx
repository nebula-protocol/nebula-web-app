import styled from 'styled-components';
import { NativeSelect as MuiNativeSelect } from '@material-ui/core';

/**
 * A styled component of the `<NativeSelect />` of the Material-UI
 *
 * @see https://material-ui.com/api/native-select/
 */
export const NativeSelect = styled(MuiNativeSelect)`
  border-radius: 8px;

  font-size: 14px;

  height: 55px;

  padding-left: 20px;

  .MuiNativeSelect-icon {
    right: 20px;
  }

  border: 1px solid ${({ theme }) => theme.colors.gray34};
  color: ${({ theme }) => theme.colors.white92};

  .MuiNativeSelect-icon {
    color: currentColor;
  }

  &:before,
  &:after {
    display: none;
  }

  &.Mui-focused {
    .MuiNativeSelect-root {
      background-color: transparent;
    }
  }

  &.Mui-disabled {
    opacity: 0.3;
  }
`;
