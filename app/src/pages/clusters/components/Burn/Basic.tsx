import { WalletIcon } from '@nebula-js/icons';
import { formatToken, formatUInput, formatUToken } from '@nebula-js/notation';
import { CT } from '@nebula-js/types';
import {
  breakpoints,
  Button,
  EmptyButton,
  TokenInput,
  TokenSpan,
  useScreenSizeValue,
} from '@nebula-js/ui';
import { ClusterInfo } from '@nebula-js/webapp-fns';
import { useClusterRedeemBasicForm } from '@nebula-js/webapp-provider';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { FeeBox } from 'components/boxes/FeeBox';
import { fixHMR } from 'fix-hmr';
import { WithdrawnTokenTable } from 'pages/clusters/components/Burn/WithdrawnTokenTable';
import React, { useCallback } from 'react';
import styled from 'styled-components';

export interface BurnBasicProps {
  className?: string;
  clusterInfo: ClusterInfo;
}

function BurnBasicBase({
  className,
  clusterInfo: { clusterState, clusterTokenInfo, assetTokenInfos },
}: BurnBasicProps) {
  const connectedWallet = useConnectedWallet();

  const [updateInput, states] = useClusterRedeemBasicForm({ clusterState });

  const buttonSize = useScreenSizeValue<'normal' | 'medium'>({
    mobile: 'medium',
    tablet: 'normal',
    pc: 'normal',
    monitor: 'normal',
  });

  const proceed = useCallback((tokenAmount: CT) => {}, []);

  return (
    <div className={className}>
      <TokenInput<CT>
        className="token-input"
        maxDecimalPoints={6}
        value={states.tokenAmount ?? ('' as CT)}
        onChange={(nextTokenAmount) =>
          updateInput({ tokenAmount: nextTokenAmount })
        }
        placeholder="0.00"
        label="INPUT"
        suggest={
          <EmptyButton
            onClick={() =>
              updateInput({
                tokenAmount: formatUInput(states.tokenBalance) as CT,
              })
            }
          >
            <WalletIcon
              style={{
                transform: 'translateX(-0.3em)',
              }}
            />{' '}
            {formatUToken(states.tokenBalance)}
          </EmptyButton>
        }
        token={<TokenSpan>{clusterTokenInfo.symbol}</TokenSpan>}
        error={states.invalidTokenAmount}
      />

      {'redeemTokenAmounts' in states &&
        Array.isArray(states.redeemTokenAmounts) && (
          <WithdrawnTokenTable
            redeemTokenAmounts={states.redeemTokenAmounts}
            assetTokenInfos={assetTokenInfos}
          />
        )}

      <FeeBox className="feebox">
        {'burntTokenAmount' in states && states.burntTokenAmount && (
          <li>
            <span>Burnt {clusterTokenInfo.symbol}</span>
            <span>
              {formatToken(states.burntTokenAmount)} {clusterTokenInfo.symbol}
            </span>
          </li>
        )}

        {'redeemValue' in states && states.redeemValue && (
          <li>
            <span>Redeem Value</span>
            <span>{formatToken(states.redeemValue)} UST</span>
          </li>
        )}

        {/*<li>*/}
        {/*  <span>Tx Fee</span>*/}
        {/*  <span>{'txFee' in states ? formatUToken(states.txFee) : 0} UST</span>*/}
        {/*</li>*/}
      </FeeBox>

      <Button
        className="submit"
        color="paleblue"
        size={buttonSize}
        disabled={
          !connectedWallet ||
          !connectedWallet.availablePost ||
          !!states.invalidTokenAmount ||
          states.tokenAmount.length > 0
        }
        onClick={() => proceed(states.tokenAmount)}
      >
        Burn
      </Button>
    </div>
  );
}

export const StyledBurnBasic = styled(BurnBasicBase)`
  .token-input {
    margin-bottom: 2.28571429em;
  }

  .feebox {
    margin-top: 2.8em;
  }

  .submit {
    display: block;
    width: 100%;
    max-width: 360px;
    margin: 2.8em auto 0 auto;
  }

  @media (max-width: ${breakpoints.mobile.max}px) {
    .feebox {
      font-size: 0.9em;
      margin-top: 2.2em;
    }

    .submit {
      margin-top: 2.2em;
    }
  }
`;

export const BurnBasic = fixHMR(StyledBurnBasic);
