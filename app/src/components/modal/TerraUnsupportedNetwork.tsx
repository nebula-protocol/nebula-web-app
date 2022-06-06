import React from 'react';
import styled from 'styled-components';
import { Modal } from '@material-ui/core';
import { Dialog } from '@nebula-js/ui';
import { fixHMR } from 'fix-hmr';

export interface TerraUnsupportedNetworkProps {
  className?: string;
}

function TerraUnsupportedNetworkBase({
  className,
}: TerraUnsupportedNetworkProps) {
  return (
    <Modal open={true}>
      <Dialog className={className}>
        <h1>You're connected to an unsupported network.</h1>
        <span>Please connect to the Terra Classic network and reload.</span>
      </Dialog>
    </Modal>
  );
}

const StyledTerraUnsupportedNetwork = styled(TerraUnsupportedNetworkBase)`
  h1 {
    font-size: var(--font-size20);
    font-weight: 500;
    line-height: 1em;
    margin-bottom: 1.14285714em;
  }

  span {
    color: var(--color-white64);
    line-height: 1.5em;
  }

  @media (max-width: 699px) {
    .dialog-content {
      width: unset;
    }

    padding-bottom: 0;
  }
`;

export const TerraUnsupportedNetwork = fixHMR(StyledTerraUnsupportedNetwork);
