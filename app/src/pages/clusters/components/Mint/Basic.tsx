import { WalletIcon } from '@nebula-js/icons';
import { formatUInput, formatUToken } from '@libs/formatter';
import { Token, u, UST } from '@nebula-js/types';
import {
  breakpoints,
  Button,
  EmptyButton,
  TokenInput,
  TokenSpan,
  useScreenSizeValue,
} from '@nebula-js/ui';
import { ClusterInfo } from '@nebula-js/app-fns';
import {
  useClusterMintBasicForm,
  useClusterMintTx,
} from '@nebula-js/app-provider';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { FeeBox } from 'components/boxes/FeeBox';
import { useTxBroadcast } from 'contexts/tx-broadcast';
import { fixHMR } from 'fix-hmr';
import React, { useCallback } from 'react';
import styled from 'styled-components';
import { ProvidedTokenTable } from './ProvidedTokenTable';

export interface MintBasicProps {
  className?: string;
  clusterInfo: ClusterInfo;
}

function MintBasicBase({
  className,
  clusterInfo: { clusterState, assetTokenInfos, clusterTokenInfo },
}: MintBasicProps) {
  const connectedWallet = useConnectedWallet();

  const { broadcast } = useTxBroadcast();

  const postTx = useClusterMintTx(
    clusterState.cluster_contract_address,
    clusterState.target,
  );

  const [updateInput, states] = useClusterMintBasicForm({ clusterState });

  const initForm = useCallback(() => {
    updateInput({
      ustAmount: '' as UST,
    });
  }, [updateInput]);

  const proceed = useCallback(
    (amounts: u<Token>[], txFee: u<UST>) => {
      const stream = postTx?.({
        amounts,
        txFee,
        onTxSucceed: initForm,
      });

      if (stream) {
        console.log('Advanced.tsx..()', stream);
        broadcast(stream);
      }
    },
    [broadcast, initForm, postTx],
  );

  const buttonSize = useScreenSizeValue<'normal' | 'medium'>({
    mobile: 'medium',
    tablet: 'normal',
    pc: 'normal',
    monitor: 'normal',
  });

  return (
    <div className={className}>
      <TokenInput<UST>
        className="token-input"
        maxDecimalPoints={6}
        value={states.ustAmount ?? ('' as UST)}
        onChange={(nextUstAmount) => updateInput({ ustAmount: nextUstAmount })}
        placeholder="0.00"
        label="FROM"
        suggest={
          <EmptyButton
            onClick={() =>
              updateInput({
                ustAmount: formatUInput(states.maxUstAmount) as UST,
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
        token={<TokenSpan>UST</TokenSpan>}
      />

      {'providedAmounts' in states && Array.isArray(states.providedAmounts) && (
        <ProvidedTokenTable
          providedAmounts={states.providedAmounts}
          assetTokenInfos={assetTokenInfos}
        />
      )}

      <FeeBox className="feebox">
        {'mintedAmount' in states && states.mintedAmount && (
          <li>
            <span>Burnt {clusterTokenInfo.symbol}</span>
            <span>
              {formatUToken(states.mintedAmount)} {clusterTokenInfo.symbol}
            </span>
          </li>
        )}

        {states.txFee !== null && (
          <li>
            <span>Tx Fee</span>
            <span>{formatUToken(states.txFee)} UST</span>
          </li>
        )}
      </FeeBox>

      <Button
        className="submit"
        color="paleblue"
        size={buttonSize}
        disabled={
          !connectedWallet ||
          !connectedWallet.availablePost ||
          !states ||
          //!!states.invalidTokenAmount ||
          !(
            'providedAmounts' in states && Array.isArray(states.providedAmounts)
          ) ||
          states.ustAmount.length === 0 ||
          !states.txFee
        }
        onClick={() =>
          'providedAmounts' in states &&
          Array.isArray(states.providedAmounts) &&
          states.txFee &&
          proceed(states.providedAmounts, states.txFee)
        }
      >
        Mint
      </Button>
    </div>
  );
}

export const StyledMintBasic = styled(MintBasicBase)`
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

export const MintBasic = fixHMR(StyledMintBasic);
