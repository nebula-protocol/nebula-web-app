import { formatUInput, formatUToken, microfy } from '@libs/formatter';
import { ClusterInfo } from '@nebula-js/app-fns';
import {
  useClusterRedeemAdvancedForm,
  useClusterRedeemTx,
} from '@nebula-js/app-provider';
import { WalletIcon } from '@nebula-js/icons';
import { CT, u, UST } from '@nebula-js/types';
import { breakpoints, TextButton, TokenInput, TokenSpan } from '@nebula-js/ui';
import { FeeBox } from 'components/boxes/FeeBox';
import { useTxBroadcast } from 'contexts/tx-broadcast';
import { fixHMR } from 'fix-hmr';
import React, { useCallback } from 'react';
import styled from 'styled-components';
import { WithdrawnTokenTable } from './WithdrawnTokenTable';
import { TokenFormBurn } from './TokenFormBurn';

export interface BurnAdvancedProps {
  className?: string;
  clusterInfo: ClusterInfo;
}

function BurnAdvancedBase({ className, clusterInfo }: BurnAdvancedProps) {
  const { clusterState, clusterTokenInfo, assetTokenInfos } = clusterInfo;

  const [updateInput, states] = useClusterRedeemAdvancedForm({ clusterState });

  const { broadcast } = useTxBroadcast();

  const postTx = useClusterRedeemTx(
    clusterState.cluster_contract_address,
    clusterState.cluster_token,
    clusterState.target,
  );

  const initForm = useCallback(() => {
    updateInput({
      tokenAmount: '' as CT,
    });
  }, [updateInput]);

  const proceed = useCallback(
    (tokenAmount: CT, txFee: u<UST>) => {
      const stream = postTx?.({
        amount: microfy(tokenAmount).toFixed() as u<CT>,
        txFee,
        onTxSucceed: initForm,
      });

      if (stream) {
        console.log('Basic.tsx..()', stream);
        broadcast(stream);
      }
    },
    [broadcast, initForm, postTx],
  );

  return (
    <div className={className}>
      <p>1. Choose maximum amount to burn</p>
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
          <TextButton
            fontSize={12}
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
          </TextButton>
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

      <p>2. Select tokens to redeem and their amount</p>

      <TokenFormBurn
        clusterInfo={clusterInfo}
        updateInput={updateInput}
        states={states}
        onProceed={proceed}
      >
        <FeeBox className="feebox">
          {'burntTokenAmount' in states && states.burntTokenAmount && (
            <li>
              <span>Burnt {clusterTokenInfo.symbol}</span>
              <span>
                {formatUToken(states.burntTokenAmount)}{' '}
                {clusterTokenInfo.symbol}
              </span>
            </li>
          )}

          {'redeemValue' in states && states.redeemValue && (
            <li>
              <span>Redeem Value</span>
              <span>{formatUToken(states.redeemValue)} UST</span>
            </li>
          )}

          {states.txFee !== null && (
            <li>
              <span>Tx Fee</span>
              <span>{formatUToken(states.txFee)} UST</span>
            </li>
          )}
        </FeeBox>
      </TokenFormBurn>
    </div>
  );
}

export const StyledBurnAdvanced = styled(BurnAdvancedBase)`
  p {
    margin-bottom: 0.857142em;
    color: var(--color-white44);
    font-weight: 500;
    font-stretch: normal;
    font-style: normal;
    line-height: normal;
    letter-spacing: normal;
  }

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

export const BurnAdvanced = fixHMR(StyledBurnAdvanced);
