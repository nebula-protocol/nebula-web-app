import { formatUInput, formatUToken, microfy } from '@libs/formatter';
import { ClusterInfo } from '@nebula-js/app-fns';
import {
  useClusterArbRedeemTx,
  useClusterRedeemTerraswapArbitrageForm,
} from '@nebula-js/app-provider';
import { WalletIcon } from '@nebula-js/icons';
import { u, Luna, Rate } from '@nebula-js/types';
import {
  breakpoints,
  Button,
  Disclosure,
  FormLabel,
  GuideInfo,
  TextButton,
  TokenInput,
  TokenSpan,
  useScreenSizeValue,
} from '@nebula-js/ui';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { FeeBox } from 'components/boxes/FeeBox';
import { SlippageToleranceInput } from 'components/form/SlippageToleranceInput';
import { WarningMessageBox } from 'components/boxes/WarningMessageBox';
import { useTxBroadcast } from 'contexts/tx-broadcast';
import { fixHMR } from 'fix-hmr';
import { WithdrawnTokenTable } from 'pages/clusters/components/Burn/WithdrawnTokenTable';
import React, { useCallback, useState } from 'react';
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
  // ---------------------------------------------
  // dependencies
  // ---------------------------------------------

  const connectedWallet = useConnectedWallet();

  const { broadcast } = useTxBroadcast();

  const postTx = useClusterArbRedeemTx(
    clusterState.cluster_contract_address,
    terraswapPair.contract_addr,
    clusterState.target,
  );

  // ---------------------------------------------
  // states
  // ---------------------------------------------

  const [openMoreOptions, setOpenMoreOptions] = useState<boolean>(false);

  const [updateInput, states] = useClusterRedeemTerraswapArbitrageForm({
    clusterState,
    terraswapPair,
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
    (lunaAmount: Luna, txFee: u<Luna>, maxSpread: Rate) => {
      const stream = postTx?.({
        amount: microfy(lunaAmount).toFixed() as u<Luna>,
        txFee,
        maxSpread,
        onTxSucceed: initForm,
      });

      if (stream) {
        broadcast(stream);
      }
    },
    [broadcast, initForm, postTx],
  );

  // ---------------------------------------------
  // presentaion
  // ---------------------------------------------

  const buttonSize = useScreenSizeValue<'normal' | 'medium'>({
    mobile: 'medium',
    tablet: 'normal',
    pc: 'normal',
    monitor: 'normal',
  });

  return (
    <div className={className}>
      <GuideInfo link="https://docs.neb.money/guide/clusters.html#arbitraging">
        <span>
          Enables profitable arbitraging when the cluster’s market price is
          lower than its intrinsic price
          <span id="extra">
            <br />
            <br />
            The mode:
            <br />
            <br />
            <span className="indent-text">
              1. Uses the user’s input Luna amount to buy cluster tokens from
              Astroport at a discount
            </span>
            <br />
            <br />
            <span className="indent-text">
              2. Burns the cluster tokens and returns the received inventory
              assets back to the user
            </span>
          </span>
        </span>
      </GuideInfo>
      <TokenInput<Luna>
        className="token-input"
        maxDecimalPoints={6}
        value={states.lunaAmount ?? ('' as Luna)}
        onChange={(nextUstAmount) => updateInput({ lunaAmount: nextUstAmount })}
        placeholder="0.00"
        label="INPUT"
        suggest={
          <TextButton
            fontSize={12}
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
          </TextButton>
        }
        token={<TokenSpan symbol="Luna">Luna</TokenSpan>}
        error={states.invalidUstAmount}
      />

      <Disclosure
        className="more-options"
        title="More Options"
        open={openMoreOptions}
        onChange={setOpenMoreOptions}
      >
        <FormLabel label="Max Spread">
          <SlippageToleranceInput
            initialCustomValue={'0.1' as Rate}
            value={states.maxSpread}
            onChange={(nextMaxSpread) =>
              updateInput({ maxSpread: nextMaxSpread })
            }
          />
        </FormLabel>
      </Disclosure>

      {'redeemTokenAmounts' in states &&
        Array.isArray(states.redeemTokenAmounts) && (
          <WithdrawnTokenTable
            redeemTokenAmounts={states.redeemTokenAmounts}
            prices={clusterState.prices}
            assetTokenInfos={assetTokenInfos}
          />
        )}

      <FeeBox className="feebox">
        {'minBurntTokenAmount' in states && states.minBurntTokenAmount && (
          <li>
            <span>Minimum Burnt {clusterTokenInfo.symbol}</span>
            <span>
              {formatUToken(states.minBurntTokenAmount)}{' '}
              {clusterTokenInfo.symbol}
            </span>
          </li>
        )}

        {'totalRedeemValue' in states && states.totalRedeemValue && (
          <li>
            <span>Minimum Redeem Value</span>
            <span>{formatUToken(states.totalRedeemValue)} Luna</span>
          </li>
        )}

        {'pnl' in states && states.pnl && (
          <li>
            <span>PNL</span>
            <span>{formatUToken(states.pnl)} Luna</span>
          </li>
        )}

        {'txFee' in states && states.txFee && (
          <li>
            <span>Tx Fee</span>
            <span>{formatUToken(states.txFee)} Luna</span>
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
          !('minBurntTokenAmount' in states && states.minBurntTokenAmount) ||
          states.lunaAmount.length === 0 ||
          Number(states.lunaAmount) === 0
        }
        onClick={() =>
          'txFee' in states &&
          states.txFee &&
          proceed(states.lunaAmount, states.txFee, states.maxSpread)
        }
      >
        Arb
      </Button>
    </div>
  );
}

export const StyledBurnTerraswapArbitrage = styled(BurnTerraswapArbitrageBase)`
  .token-input {
    margin-bottom: 2.28571429em;
    margin-top: 2.28571429em;
  }

  .warning {
    margin-top: 2.14285714em;
  }

  .more-options {
    margin-top: 2.14285714em;
    margin-bottom: 2.14285714em;
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
