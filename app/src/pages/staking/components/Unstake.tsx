import { WalletIcon } from '@nebula-js/icons';
import {
  formatFluidDecimalPoints,
  formatUInput,
  formatUToken,
  microfy,
} from '@libs/formatter';
import { CT, LP, u, UST } from '@nebula-js/types';
import {
  breakpoints,
  Button,
  EmptyButton,
  TokenInput,
  TokenSpan,
  useScreenSizeValue,
} from '@nebula-js/ui';
import { StakingPoolInfo } from '@nebula-js/webapp-fns';
import {
  useStakingUnstakeForm,
  useStakingUnstakeTx,
} from '@nebula-js/webapp-provider';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import big, { BigSource } from 'big.js';
import { FeeBox } from 'components/boxes/FeeBox';
import { WarningMessageBox } from 'components/boxes/WarningMessageBox';
import { ExchangeRateAB } from 'components/text/ExchangeRateAB';
import { useTxBroadcast } from 'contexts/tx-broadcast';
import { fixHMR } from 'fix-hmr';
import React, { useCallback } from 'react';
import styled from 'styled-components';

export interface StakingUnstakeProps {
  className?: string;
  poolInfo: StakingPoolInfo;
}

function StakingUnstakeBase({
  className,
  poolInfo: { tokenAddr, tokenInfo, terraswapPair },
}: StakingUnstakeProps) {
  const connectedWallet = useConnectedWallet();

  const { broadcast } = useTxBroadcast();

  const postTx = useStakingUnstakeTx(
    tokenAddr,
    terraswapPair.contract_addr,
    terraswapPair.liquidity_token,
  );

  const [updateInput, states] = useStakingUnstakeForm<CT>({
    ustTokenPairAddr: terraswapPair.contract_addr,
    tokenAddr: tokenAddr,
  });

  const initForm = useCallback(() => {
    updateInput({
      lpAmount: '' as LP,
    });
  }, [updateInput]);

  const proceed = useCallback(
    async (lpAmount: LP, txFee: u<UST<BigSource>>) => {
      const stream = postTx?.({
        lpAmount: microfy(lpAmount).toFixed() as u<LP>,
        txFee: big(txFee).toFixed() as u<UST>,
        onTxSucceed: initForm,
      });

      if (stream) {
        broadcast(stream);
      }
    },
    [broadcast, initForm, postTx],
  );

  // ---------------------------------------------
  // presentation
  // ---------------------------------------------
  const buttonSize = useScreenSizeValue<'normal' | 'medium'>({
    mobile: 'medium',
    tablet: 'normal',
    pc: 'normal',
    monitor: 'normal',
  });

  return (
    <div className={className}>
      <TokenInput
        maxDecimalPoints={6}
        value={states.lpAmount}
        onChange={(nextLpAmount) => updateInput({ lpAmount: nextLpAmount })}
        placeholder="0.00"
        label="AMOUNT"
        suggest={
          <EmptyButton
            onClick={() =>
              updateInput({
                lpAmount: formatUInput(states.maxLpAmount) as u<LP>,
              })
            }
          >
            <WalletIcon
              style={{
                transform: 'translateX(-0.3em)',
              }}
            />{' '}
            {formatUToken(states.maxLpAmount)}
          </EmptyButton>
        }
        token={<TokenSpan>{tokenInfo.symbol}-UST LP</TokenSpan>}
        error={states.invalidLpAmount}
      />

      <FeeBox className="feebox">
        {states.poolPrice && (
          <li>
            <span>Price</span>
            <ExchangeRateAB
              symbolA="UST"
              symbolB={tokenInfo.symbol}
              exchangeRateAB={states.poolPrice}
              initialDirection="a/b"
              formatExchangeRate={(price) => formatFluidDecimalPoints(price, 6)}
            />
          </li>
        )}
        {states.returnedUstAmount && states.returnedTokenAmount && (
          <li>
            <span>Returned</span>
            <span>
              {formatUToken(states.returnedTokenAmount)} NEB +{' '}
              {formatUToken(states.returnedUstAmount)} UST
            </span>
          </li>
        )}
        {states.txFee && (
          <li>
            <span>Tx Fee</span>
            <span>{formatUToken(states.txFee)} UST</span>
          </li>
        )}
      </FeeBox>

      {states.invalidTxFee && (
        <WarningMessageBox level="critical" className="warning">
          {states.invalidTxFee}
        </WarningMessageBox>
      )}

      <Button
        className="submit"
        color="paleblue"
        size={buttonSize}
        disabled={
          !connectedWallet ||
          !connectedWallet.availablePost ||
          !postTx ||
          !states ||
          !states.availableTx
        }
        onClick={() =>
          states.lpAmount &&
          states.txFee &&
          proceed(states.lpAmount, states.txFee)
        }
      >
        Unstake
      </Button>
    </div>
  );
}

const StyledStakingUnstake = styled(StakingUnstakeBase)`
  font-size: 1rem;

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

export const StakingUnstake = fixHMR(StyledStakingUnstake);
