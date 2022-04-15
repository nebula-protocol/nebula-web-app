import { useLocalStorage } from '@libs/use-local-storage';
import { useWallet, WalletStatus } from '@terra-money/use-wallet';
import React, { useCallback, useMemo, useState } from 'react';
import styled from 'styled-components';
import { Modal } from '@material-ui/core';
import { Dialog, TextLink } from '@nebula-js/ui';
import { Button, useScreenSizeValue } from '@nebula-js/ui';
import { fixHMR } from 'fix-hmr';

export interface DisclaimerModalProps {
  className?: string;
}

function DisclaimerModalBase({ className }: DisclaimerModalProps) {
  const { status } = useWallet();

  const [acceptedTerms, setAcceptedTerms] = useLocalStorage<'true' | 'false'>(
    '__nebula_accepted_terms_conditions__',
    () => 'false',
  );

  const [check, setCheck] = useState(false);

  const open = useMemo(() => {
    return (
      status === WalletStatus.WALLET_CONNECTED && !JSON.parse(acceptedTerms)
    );
  }, [status, acceptedTerms]);

  const handleClose = useCallback(() => {
    setAcceptedTerms('true');
  }, [setAcceptedTerms]);

  const buttonSize = useScreenSizeValue<'medium' | 'normal'>({
    mobile: 'medium',
    tablet: 'normal',
    pc: 'normal',
    monitor: 'normal',
  });

  return (
    <Modal open={open}>
      <Dialog className={className}>
        <h1>Disclaimer</h1>
        <span>
          Please check the box below to confirm your agreement to the{' '}
          <TextLink
            href="https://docs.neb.money/protocol/clusters#rebalancing"
            target="_blank"
            rel="noreferrer"
            hoverStyle
            className="nebula-terms-link"
          >
            Terms & conditions
          </TextLink>
        </span>

        <div className="line-separator" />

        <div className="form-container" onClick={() => setCheck(!check)}>
          <input type="checkbox" checked={check} readOnly />
          <p>
            I acknowledge and understand the risks associated with using this
            site
          </p>
        </div>
        <Button
          color="paleblue"
          size={buttonSize}
          onClick={handleClose}
          disabled={!check}
          className="accept-button"
        >
          I Accept
        </Button>
      </Dialog>
    </Modal>
  );
}

const StyledDisclaimerModal = styled(DisclaimerModalBase)`
  h1 {
    font-size: var(--font-size20);
    font-weight: 500;
    line-height: 1em;
    margin-bottom: 1.14285714em;
  }

  .dialog-content {
    margin: 30px;
    width: 370px;
  }

  span {
    color: var(--color-white64);
    line-height: 1.5em;
  }

  .nebula-terms-link {
    font-weight: 500;
  }

  .form-container {
    display: flex;
    cursor: pointer;

    > p {
      color: var(--color-white100);
      line-height: 1.5em;
    }

    input[type='checkbox'] {
      position: relative;
      margin-right: 1.142857em;
    }

    input[type='checkbox']:before {
      content: '';
      display: block;
      position: absolute;
      width: 16px;
      height: 16px;
      top: 0;
      left: 0;
      border: 1px solid var(--color-white100);
      border-radius: 3px;
      background-color: var(--color-gray18);
    }

    input[type='checkbox']:checked:after {
      content: '';
      display: block;
      width: 10px;
      height: 10px;
      background-color: var(--color-white100);
      position: absolute;
      top: 3px;
      left: 3px;
    }
  }

  .line-separator {
    height: 1px;
    width: 100%;
    background-color: var(--color-gray24);
    margin: 1.14285714em 0;
  }

  .accept-button {
    margin-top: 1.714285em;
    width: 100%;
    height: 48px;
    font-size: var(--font-size14);
  }

  @media (max-width: 699px) {
    .dialog-content {
      width: unset;
    }

    padding-bottom: 0;
  }
`;

export const DisclaimerModal = fixHMR(StyledDisclaimerModal);
