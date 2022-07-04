import styled from 'styled-components';
import { NativeSelect as MuiNativeSelect } from '@material-ui/core';

/**
 * A styled component of the `<NativeSelect />` of the Material-UI
 *
 * @see https://material-ui.com/api/native-select/
 */
export const NativeSelect = styled(MuiNativeSelect)`
  border-radius: 8px;

  font-size: 1rem;

  height: 4rem;

  padding-left: 1.5rem;

  .MuiNativeSelect-icon {
    right: 1.5rem;
  }

  border: 1px solid var(--color-gray7);
  color: var(--color-white2);

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
