import { u, NEB } from '@nebula-js/types';
import { IconButton } from '@material-ui/core';
import { Close } from '@material-ui/icons';
import { Button } from '@nebula-js/ui';
import React from 'react';
import styled from 'styled-components';
import { AirdropImage } from './AirdropImage';
import { formatUToken } from '@libs/formatter';

function AirdropBase({
  className,
  onClose,
  claim,
  isMobileLayout,
  amount,
  disabled,
}: {
  className?: string;
  onClose: () => void;
  claim: () => void;
  isMobileLayout?: boolean;
  amount: u<NEB>;
  disabled: boolean;
}) {
  return (
    <div
      className={className}
      data-layout={isMobileLayout ? 'mobile' : 'modal'}
    >
      <div>
        <AirdropImage />
      </div>
      <div>
        <h2>Airdrop</h2>
        <p>Claim your {formatUToken(amount)} NEB</p>
        <Button className="claim-button" onClick={claim} disabled={disabled}>
          Claim
        </Button>
        <IconButton className="close" size="small" onClick={onClose}>
          <Close />
        </IconButton>
      </div>
    </div>
  );
}

export const AirdropContent = styled(AirdropBase)`
  text-align: center;

  position: relative;

  h2 {
    margin-top: 12px;

    font-size: 20px;
    font-weight: 500;
    color: var(--color-white92);
  }

  p {
    margin-top: 5px;

    font-size: 12px;
    font-weight: normal;
    color: var(--color-white80);
  }

  a {
    margin-top: 15px;

    width: 100%;
    height: 28px;
  }

  .close {
    position: absolute;
    right: 0px;
    top: -10px;
    color: var(--color-gray44);
    svg {
      font-size: 16px;
    }
  }

  .claim-button {
    margin-top: 28px;
    width: 100%;
    height: 42px;
    font-size: 14px;
    font-weight: 500;
  }

  &[data-layout='mobile'] {
    margin: 0;
    padding: 16px 20px;

    display: flex;
    align-items: center;

    background-color: var(--color-gray18);

    h2 {
      margin-top: 0;
    }

    .claim-button {
      margin-top: 28px;
      width: 100%;
      height: 28px;
      font-size: 14px;
      font-weight: 500;
    }

    .claim-button {
      margin-top: 16px;
    }

    > :first-child {
      width: 100px;
    }

    > :last-child {
      flex: 1;

      padding-left: 5px;
      text-align: left;

      a {
        margin-top: 8px;
      }

      .close {
        right: 20px;
        top: 20px;
      }
    }
  }
`;
