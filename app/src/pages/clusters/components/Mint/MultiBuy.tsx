import { WalletIcon } from '@nebula-js/icons';
import { formatUInput, formatUToken } from '@libs/formatter';
import { u, Luna } from '@nebula-js/types';
import { RotateSpinner } from 'react-spinners-kit';
import {
  breakpoints,
  Button,
  EmptyButton,
  TokenInput,
  TokenSpan,
  useScreenSizeValue,
} from '@nebula-js/ui';
import { SwapTokenInfo, ClusterInfo } from '@nebula-js/app-fns';
import {
  useMultiBuyForm,
  useCW20MultiBuyTokensTx,
} from '@nebula-js/app-provider';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { FeeBox } from 'components/boxes/FeeBox';
import { useTxBroadcast } from 'contexts/tx-broadcast';
import { fixHMR } from 'fix-hmr';
import React, { useCallback } from 'react';
import styled from 'styled-components';
import { TokenTable } from './TokenTable';
import { WarningMessageBox } from 'components/boxes/WarningMessageBox';

export interface MultiBuyProps {
  className?: string;
  clusterInfo: ClusterInfo;
  isArbitrage?: boolean;
}

function MultiBuyBase({
  className,
  clusterInfo: { clusterState, assetTokenInfos, terraswapPair },
  isArbitrage = false,
}: MultiBuyProps) {
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------
  const connectedWallet = useConnectedWallet();

  const { broadcast } = useTxBroadcast();

  const postTx = useCW20MultiBuyTokensTx();

  // ---------------------------------------------
  // states
  // ---------------------------------------------
  const [updateInput, states] = useMultiBuyForm({
    clusterState,
    terraswapPair,
    isArbitrage,
  });

  // ---------------------------------------------
  // callbacks
  // ---------------------------------------------
  const initForm = useCallback(() => {
    updateInput({
      lunaAmount: '' as Luna,
    });
  }, [updateInput]);

  const proceed = useCallback(
    (buyTokens: SwapTokenInfo[], txFee: u<Luna>) => {
      const stream = postTx?.({
        buyTokens,
        txFee,
        onTxSucceed: () => {
          initForm();
        },
      });

      if (stream) {
        broadcast(stream);
      }
    },
    [broadcast, initForm, postTx],
  );

  // ---------------------------------------------
  // presentations
  // ---------------------------------------------
  const buttonSize = useScreenSizeValue<'normal' | 'medium'>({
    mobile: 'medium',
    tablet: 'normal',
    pc: 'normal',
    monitor: 'normal',
  });

  return (
    <div className={className}>
      <TokenInput<Luna>
        className="token-input"
        maxDecimalPoints={6}
        value={states.lunaAmount ?? ('' as Luna)}
        onChange={(nextUstAmount) => updateInput({ lunaAmount: nextUstAmount })}
        placeholder="0.00"
        label="FROM"
        suggest={
          <EmptyButton
            onClick={() =>
              updateInput({
                lunaAmount: formatUInput(states.maxUstAmount) as Luna,
              })
            }
          >
            <WalletIcon
              style={{
                transform: 'translateX(-0.3em)',
              }}
            />{' '}
            {formatUToken(states.maxUstAmount)}
          </EmptyButton>
        }
        token={<TokenSpan symbol="Luna">Luna</TokenSpan>}
        error={states.invalidUstAmount}
      />

      {/* loading state */}
      {states.lunaAmount.length > 0 &&
        states.lunaAmount !== '0' &&
        !('boughtTokens' in states) && (
          <div className="loading-container">
            <RotateSpinner color="var(--color-paleblue)" />
          </div>
        )}

      {'boughtTokens' in states && Array.isArray(states.boughtTokens) && (
        <TokenTable
          name="Bought Amount"
          amounts={states.boughtTokens.map(({ returnAmount }) => returnAmount)}
          prices={states.boughtTokens.map(({ beliefPrice }) => beliefPrice)}
          assetTokenInfos={assetTokenInfos}
        />
      )}

      <FeeBox className="feebox">
        {states.txFee !== null && (
          <li>
            <span>Tx Fee</span>
            <span>{formatUToken(states.txFee)} Luna</span>
          </li>
        )}

        {'pnl' in states && states.pnl && (
          <li>
            <span>PNL</span>
            <span>{formatUToken(states.pnl)} Luna</span>
          </li>
        )}
      </FeeBox>

      {states.invalidSwap ? (
        <WarningMessageBox level="critical" className="warning">
          {states.invalidSwap}
        </WarningMessageBox>
      ) : states.invalidQuery ? (
        <WarningMessageBox level="critical" className="warning">
          {states.invalidQuery}
        </WarningMessageBox>
      ) : null}

      <Button
        className="submit"
        color="paleblue"
        size={buttonSize}
        disabled={
          !connectedWallet ||
          !connectedWallet.availablePost ||
          !states ||
          !!states.invalidUstAmount ||
          !!states.invalidQuery ||
          !!states.invalidSwap ||
          !('boughtTokens' in states && Array.isArray(states.boughtTokens)) ||
          states.lunaAmount.length === 0 ||
          !states.txFee
        }
        onClick={() =>
          'boughtTokens' in states &&
          Array.isArray(states.boughtTokens) &&
          states.txFee &&
          proceed(states.boughtTokens, states.txFee)
        }
      >
        Swap
      </Button>
    </div>
  );
}

export const StyledMultiBuy = styled(MultiBuyBase)`
  .token-input {
    margin-bottom: 2.28571429em;
  }

  .loading-container {
    display: flex;
    justify-content: center;
    width: 100%;
  }

  .feebox {
    margin-top: 2.8em;
  }

  .warning {
    margin-top: 2.14285714em;
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

export const MultiBuy = fixHMR(StyledMultiBuy);
