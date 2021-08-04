import { WalletIcon } from '@nebula-js/icons';
import { formatUInput, formatUToken } from '@nebula-js/notation';
import { CT, LP, u } from '@nebula-js/types';
import {
  breakpoints,
  Button,
  EmptyButton,
  TokenInput,
  TokenSpan,
  useScreenSizeValue,
} from '@nebula-js/ui';
import { ClusterInfo } from '@nebula-js/webapp-fns';
import { useCW20WithdrawTokenForm } from '@nebula-js/webapp-provider';
import { FeeBox } from 'components/boxes/FeeBox';
import { fixHMR } from 'fix-hmr';
import React from 'react';
import styled from 'styled-components';

export interface StakingUnstakeProps {
  className?: string;
  clusterInfo: ClusterInfo;
}

function StakingUnstakeBase({
  className,
  clusterInfo: { clusterState, clusterTokenInfo, terraswapPair },
}: StakingUnstakeProps) {
  const [updateInput, states] = useCW20WithdrawTokenForm<CT>({
    ustTokenPairAddr: terraswapPair.contract_addr,
    lpAddr: terraswapPair.liquidity_token,
  });

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
        token={<TokenSpan>{clusterTokenInfo.symbol}-UST LP</TokenSpan>}
        error={states.invalidLpAmount}
      />

      <FeeBox className="feebox">
        <li>
          <span>Tx Fee</span>
          <span>100 UST</span>
        </li>
      </FeeBox>

      <Button className="submit" color="paleblue" size={buttonSize}>
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
