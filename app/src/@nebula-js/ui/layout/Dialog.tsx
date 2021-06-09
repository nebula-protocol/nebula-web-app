import { CloseIcon } from '@nebula-js/icons';
import React, { DetailedHTMLProps, forwardRef, HTMLAttributes } from 'react';
import styled, { createGlobalStyle, keyframes } from 'styled-components';
import { buttonColorStyle } from '../buttons/Button';
import { EmptyButton } from '../buttons/EmptyButton';
import { getErrorBoundary } from '../error/configErrorBoundary';

export interface DialogProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  /**
   * Callback when the dialog is closed by outside click or esc key...
   */
  onClose?: () => void;
}

const DialogBase = forwardRef<HTMLDivElement, DialogProps>(
  ({ onClose, color = 'normal', children, ...divProps }: DialogProps, ref) => {
    const ErrorBoundary = getErrorBoundary();

    return (
      <div {...divProps} ref={ref} data-color={color}>
        <div className="dialog-content">
          <ErrorBoundary>{children}</ErrorBoundary>
        </div>
        {onClose && (
          <EmptyButton className="dialog-close-button" size={12} fontSize={12}>
            <CloseIcon onClick={onClose} />
          </EmptyButton>
        )}

        <ScrollLock />
      </div>
    );
  },
);

const ScrollLock = createGlobalStyle`
  html {
    overflow: hidden !important;
  }
`;

const enter = keyframes`
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.6);
  }
  
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
`;

const slide = keyframes`
  from {
    opacity: 0;
    transform: translateY(80%);
  }
  
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

/**
 * Dialog container component
 *
 * Please use with the `<Modal/>` component of the Material-UI
 *
 * ```jsx
 * <Modal open={open} onClose={() => setOpen(false)}>
 *   <Dialog onClose={() => setOpen(false)}>
 *     <h1>Title</h1>
 *     <div>Content...</div>
 *   </Dialog>
 * </Modal>
 * ```
 */
export const Dialog = styled(DialogBase)`
  background-color: ${({ theme }) => theme.colors.gray18};

  color: ${({ theme }) => theme.colors.white92};

  outline: none;

  .dialog-content {
    margin: 40px 32px;
  }

  .dialog-close-button {
    position: absolute;
    top: 20px;
    right: 20px;

    ${buttonColorStyle('dim')};

    background-color: transparent;
  }

  @media (min-width: 700px) {
    top: 50%;
    left: 50%;
    position: absolute;
    transform: translate(-50%, -50%);

    border-radius: 20px;

    box-shadow: 0 0 33px 8px rgba(0, 0, 0, 0.4);

    animation: ${enter} 0.2s ease-out;
    transform-origin: center;
  }

  @media (max-width: 699px) {
    max-width: 100vw;
    max-height: 100vh;

    overflow-y: auto;

    bottom: 0;
    left: 0;
    right: 0;
    position: absolute;

    padding-bottom: 30px;

    border-top-left-radius: 8px;
    border-top-right-radius: 8px;

    box-shadow: 0 0 33px 8px rgba(0, 0, 0, 0.4);

    animation: ${slide} 0.3s ease-out;

    .dialog-content {
      margin: 32px 24px 24px 24px;
    }
  }
`;
