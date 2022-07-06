import { formatUInput, formatUToken, microfy } from '@libs/formatter';
import { ClusterInfo } from '@nebula-js/app-fns';
import {
  useClusterRedeemBasicForm,
  useClusterRedeemTx,
} from '@nebula-js/app-provider';
import { WalletIcon } from '@nebula-js/icons';
import { CT, u, Luna } from '@nebula-js/types';
import {
  breakpoints,
  Button,
  GuideInfo,
  TextButton,
  TokenInput,
  TokenSpan,
  useScreenSizeValue,
} from '@nebula-js/ui';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { FeeBox } from 'components/boxes/FeeBox';
import { useTxBroadcast } from 'contexts/tx-broadcast';
import { fixHMR } from 'fix-hmr';
import React, { useCallback } from 'react';
import styled from 'styled-components';
import { WithdrawnTokenTable } from './WithdrawnTokenTable';

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
    (tokenAmount: CT, txFee: u<Luna>) => {
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

  const buttonSize = useScreenSizeValue<'normal' | 'medium'>({
    mobile: 'medium',
    tablet: 'normal',
    pc: 'normal',
    monitor: 'normal',
  });

  return (
    <div className={className}>
      <GuideInfo link="https://docs.neb.money/guide/clusters.html#burn-basic">
        <span>
          Enables redeeming cluster tokens to receive back the cluster’s
          inventory assets
          <span id="extra">
            {' '}
            in pro-rata amount to the cluster’s current inventory weights.
          </span>
        </span>
      </GuideInfo>
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
        token={
          <TokenSpan symbol={clusterTokenInfo.symbol}>
            {clusterTokenInfo.symbol}
          </TokenSpan>
        }
        error={states.invalidTokenAmount}
      />

      {'redeemTokenAmounts' in states &&
        Array.isArray(states.redeemTokenAmounts) && (
          <WithdrawnTokenTable
            redeemTokenAmounts={states.redeemTokenAmounts}
            prices={clusterState.prices}
            assetTokenInfos={assetTokenInfos}
          />
        )}

      <FeeBox className="feebox">
        {'burntTokenAmount' in states && states.burntTokenAmount && (
          <li>
            <span>Burnt {clusterTokenInfo.symbol}</span>
            <span>
              {formatUToken(states.burntTokenAmount)} {clusterTokenInfo.symbol}
            </span>
          </li>
        )}

        {'totalRedeemValue' in states && states.totalRedeemValue && (
          <li>
            <span>Total Redeem Value</span>
            <span>{formatUToken(states.totalRedeemValue)} Luna</span>
          </li>
        )}

        {states.txFee !== null && (
          <li>
            <span>Tx Fee</span>
            <span>{formatUToken(states.txFee)} Luna</span>
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
          !!states.invalidTokenAmount ||
          states.tokenAmount.length === 0 ||
          !states.txFee
        }
        onClick={() =>
          states.txFee && proceed(states.tokenAmount, states.txFee)
        }
      >
        Burn
      </Button>
    </div>
  );
}

export const StyledBurnBasic = styled(BurnBasicBase)`
  .token-input {
    margin-bottom: 2.28571429em;
    margin-top: 2.28571429em;
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
