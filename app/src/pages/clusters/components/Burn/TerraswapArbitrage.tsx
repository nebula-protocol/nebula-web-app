import { formatUInput, formatUToken, microfy } from '@libs/formatter';
import { ClusterInfo } from '@nebula-js/app-fns';
import {
  useClusterArbRedeemTx,
  useClusterRedeemTerraswapArbitrageForm,
} from '@nebula-js/app-provider';
import { WalletIcon } from '@nebula-js/icons';
import { u, UST } from '@nebula-js/types';
import {
  breakpoints,
  Button,
  TextButton,
  TokenInput,
  TokenSpan,
  useScreenSizeValue,
} from '@nebula-js/ui';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { FeeBox } from 'components/boxes/FeeBox';
import { WarningMessageBox } from 'components/boxes/WarningMessageBox';
import { useTxBroadcast } from 'contexts/tx-broadcast';
import { fixHMR } from 'fix-hmr';
import { WithdrawnTokenTable } from 'pages/clusters/components/Burn/WithdrawnTokenTable';
import React, { useCallback } from 'react';
import styled from 'styled-components';

export interface BurnTerraswapArbitrageProps {
  className?: string;
  clusterInfo: ClusterInfo;
}

function BurnTerraswapArbitrageBase({
  className,
  clusterInfo: {
    clusterState,
    clusterTokenInfo,
    assetTokenInfos,
    terraswapPair,
  },
}: BurnTerraswapArbitrageProps) {
  const connectedWallet = useConnectedWallet();

  const [updateInput, states] = useClusterRedeemTerraswapArbitrageForm({
    clusterState,
    terraswapPair,
  });

  const { broadcast } = useTxBroadcast();

  const postTx = useClusterArbRedeemTx(
    clusterState.cluster_contract_address,
    clusterState.target,
  );

  const initForm = useCallback(() => {
    updateInput({
      ustAmount: '' as UST,
    });
  }, [updateInput]);

  const proceed = useCallback(
    (ustAmount: UST, txFee: u<UST>) => {
      const stream = postTx?.({
        amount: microfy(ustAmount).toFixed() as u<UST>,
        txFee,
        onTxSucceed: initForm,
      });

      if (stream) {
        console.log('TerraswapArbitrage.tsx..()', stream);
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
        label="INPUT"
        suggest={
          <TextButton
            fontSize={12}
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
          </TextButton>
        }
        token={<TokenSpan>UST</TokenSpan>}
        error={states.invalidUstAmount}
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
              {formatUToken(states.burntTokenAmount)} {clusterTokenInfo.symbol}
            </span>
          </li>
        )}

        {'redeemValue' in states && states.redeemValue && (
          <li>
            <span>Redeem Value</span>
            <span>{formatUToken(states.redeemValue)} UST</span>
          </li>
        )}

        {'txFee' in states && states.txFee && (
          <li>
            <span>Tx Fee</span>
            <span>{formatUToken(states.txFee)} UST</span>
          </li>
        )}
      </FeeBox>

      {states.invalidRedeemQuery ? (
        <WarningMessageBox level="critical" className="warning">
          {states.invalidRedeemQuery}
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
          !!states.invalidRedeemQuery ||
          !!states.invalidTxFee ||
          states.ustAmount.length === 0 ||
          Number(states.ustAmount) === 0
        }
        onClick={() =>
          'txFee' in states &&
          states.txFee &&
          proceed(states.ustAmount, states.txFee)
        }
      >
        Burn
      </Button>
    </div>
  );
}

export const StyledBurnTerraswapArbitrage = styled(BurnTerraswapArbitrageBase)`
  .token-input {
    margin-bottom: 2.28571429em;
  }

  .warning {
    margin-top: 2.14285714em;
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

export const BurnTerraswapArbitrage = fixHMR(StyledBurnTerraswapArbitrage);
