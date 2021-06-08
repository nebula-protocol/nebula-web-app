import { CallMade, Check } from '@material-ui/icons';
import { formatUToken, truncate } from '@nebula-js/notation';
import { Button } from '@nebula-js/ui';
import { NebulaTokenBalances } from '@nebula-js/webapp-fns';
import { useConnectedWallet, useWallet } from '@terra-money/wallet-provider';
import { useBank } from '@terra-money/webapp-provider';
import big from 'big.js';
import React from 'react';
import useClipboard from 'react-use-clipboard';
import styled from 'styled-components';

export interface WalletDetailsProps {
  className?: string;
}

function WalletDetailsBase({ className }: WalletDetailsProps) {
  const { disconnect } = useWallet();

  const connectedWallet = useConnectedWallet();

  const [isCopied, setCopied] = useClipboard(
    connectedWallet?.walletAddress ?? '',
    {
      successDuration: 1000 * 5,
    },
  );

  const {
    tokenBalances: { uUST, uLuna },
  } = useBank<NebulaTokenBalances>();

  if (!connectedWallet) {
    return null;
  }

  return (
    <div className={className}>
      <header>
        <h2>
          {truncate(connectedWallet.walletAddress)}
          <CallMade />
        </h2>

        <Button size="tiny" color="dim" onClick={setCopied}>
          COPY ADDRESS
          {isCopied && <Check style={{ marginLeft: 7 }} />}
        </Button>
      </header>

      <ul>
        {big(uUST).gt(0) && (
          <li>
            <span>UST</span>
            <span>{formatUToken(uUST)}</span>
          </li>
        )}
        {big(uLuna).gt(0) && (
          <li>
            <span>LUNA</span>
            <span>{formatUToken(uLuna)}</span>
          </li>
        )}
      </ul>

      <footer>
        <Button size="small" color="paleblue" fullWidth>
          Send
        </Button>

        <Button size="small" color="dim" fullWidth onClick={disconnect}>
          Disconnect
        </Button>
      </footer>
    </div>
  );
}

export const WalletDetails = styled(WalletDetailsBase)`
  h2 {
    cursor: pointer;
    user-select: none;

    font-size: 18px;
    color: ${({ theme }) => theme.colors.white92};

    svg {
      font-size: 1em;
      width: 1em;
      transform: scale(0.7) translate(2px, 4px);
    }

    &:hover {
      color: ${({ theme }) => theme.colors.paleblue.main};
    }

    margin-bottom: 8px;
  }

  ul {
    margin: 40px 0 32px 0;
    padding: 0;

    border-top: 1px solid ${({ theme }) => theme.colors.gray24};

    li {
      display: flex;
      justify-content: space-between;
      border-bottom: 1px dotted ${({ theme }) => theme.colors.gray24};
      color: ${({ theme }) => theme.colors.white92};

      font-size: 12px;
      padding: 9px 0;

      > :last-child {
        font-weight: 300;
        color: ${({ theme }) => theme.colors.white92};
      }
    }
  }

  footer {
    button:last-child {
      margin-top: 12px;
    }
  }
`;
