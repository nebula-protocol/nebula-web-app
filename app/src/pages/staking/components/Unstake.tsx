import { formatUInput, formatUToken, microfy } from '@libs/formatter';
import { StakingPoolInfo } from '@nebula-js/app-fns';
import {
  useStakingUnstakeForm,
  useStakingUnstakeTx,
} from '@nebula-js/app-provider';
import { WalletIcon } from '@nebula-js/icons';
import { CT, LP, u, Luna } from '@nebula-js/types';
import {
  breakpoints,
  Button,
  CoupledIconsHolder,
  TextButton,
  TokenInput,
  TokenIcon,
  TokenSpan,
  useScreenSizeValue,
} from '@nebula-js/ui';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import big, { BigSource } from 'big.js';
import { FeeBox } from 'components/boxes/FeeBox';
import { WarningMessageBox } from 'components/boxes/WarningMessageBox';
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
    lunaTokenPairAddr: terraswapPair.contract_addr,
    tokenAddr: tokenAddr,
  });

  const initForm = useCallback(() => {
    updateInput({
      lpAmount: '' as LP,
    });
  }, [updateInput]);

  const proceed = useCallback(
    async (lpAmount: LP, txFee: u<Luna<BigSource>>) => {
      const stream = postTx?.({
        lpAmount: microfy(lpAmount).toFixed() as u<LP>,
        txFee: big(txFee).toFixed() as u<Luna>,
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
          <TextButton
            fontSize={12}
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
          </TextButton>
        }
        token={
          <TokenSpan
            icon={
              <CoupledIconsHolder radiusEm={0.9}>
                <TokenIcon symbol="Luna" />
                <TokenIcon symbol={tokenInfo.symbol} />
              </CoupledIconsHolder>
            }
          >
            {tokenInfo.symbol}-Luna LP
          </TokenSpan>
        }
        error={states.invalidLpAmount}
      />

      <FeeBox className="feebox">
        {states.returnedUstAmount && states.returnedTokenAmount && (
          <li>
            <span>Returned</span>
            <span>
              {formatUToken(states.returnedTokenAmount)} {tokenInfo.symbol} +{' '}
              {formatUToken(states.returnedUstAmount)} Luna
            </span>
          </li>
        )}
        {states.txFee && (
          <li>
            <span>Tx Fee</span>
            <span>{formatUToken(states.txFee)} Luna</span>
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
