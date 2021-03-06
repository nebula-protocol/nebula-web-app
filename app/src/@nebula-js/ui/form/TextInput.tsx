import { TextField, TextFieldProps } from '@material-ui/core';
import { ComponentType } from 'react';
import styled, { css } from 'styled-components';

/**
 * Styled component of the `<TextField/>` of the Material-UI
 *
 * @see https://material-ui.com/api/text-field/
 */
export const TextInput: ComponentType<TextFieldProps> = styled(TextField)`
  border-radius: 8px;

  border: 1px solid var(--color-gray34);
  ${({ error }) =>
    error &&
    css`
      border: 1px solid var(--color-red);
    `}

  .MuiFormLabel-root {
    opacity: 1;
    color: var(--color-white92);
  }

  .MuiFormLabel-root.Mui-focused {
    opacity: 1;
    color: var(--color-white92);
  }

  .MuiFormLabel-root.Mui-error {
    color: var(--color-white92);
  }

  .MuiInputLabel-formControl {
    transform: translate(20px, 22px) scale(1);
  }

  .MuiInputLabel-shrink {
    transform: translate(20px, 12px) scale(0.7);
  }

  .MuiInputLabel-shrink + .MuiInputBase-root {
    .MuiInputBase-input {
      transform: translateY(8px);
    }
  }

  .MuiInput-root {
    margin: 10px 20px;
    color: var(--color-white92);
  }

  .MuiInput-root.MuiInput-fullWidth {
    width: auto;
  }

  .MuiInput-root.Mui-error {
    color: var(--color-white92);
  }

  .MuiInput-underline:before,
  .MuiInput-underline:after {
    display: none;
  }

  .MuiFormHelperText-root {
    position: absolute;
    right: 0;
    bottom: -20px;
  }

  ${({ disabled }) => (disabled ? 'opacity: 0.5' : '')};

  .Mui-disabled {
    opacity: 0.5;
  }
` as any;
