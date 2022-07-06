import { useCW20PoolInfoQuery } from '@libs/app-provider';
import { formatRate, formatUTokenWithPostfixUnits } from '@libs/formatter';
import { useMypageStakingQuery, useNebulaApp } from '@nebula-js/app-provider';
import { useStakingAPR } from '@nebula-js/app-provider';
import { NEB, Token, u, Luna } from '@nebula-js/types';
import {
  Button,
  Descriptions,
  HorizontalScrollTable,
  Table3SectionHeader,
  TwoLine,
  useScreenSizeValue,
} from '@nebula-js/ui';
import big, { Big } from 'big.js';
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

export interface StakingProps {
  className?: string;
}

function StakingBase({ className }: StakingProps) {
  const { contractAddress } = useNebulaApp();

  const { data = [] } = useMypageStakingQuery();

  const { data: nebInfo } = useCW20PoolInfoQuery<NEB>(contractAddress.cw20.NEB);

  const getStakingAPR = useStakingAPR();

  const stakings = useMemo(() => {
    return data.map(
      ({ tokenAddr, tokenInfo, rewardInfo, terraswapPoolInfo, poolInfo }) => {
        const withdrawableToken = big(terraswapPoolInfo.tokenPoolSize)
          .mul(rewardInfo.bond_amount)
          .div(
            terraswapPoolInfo.lpShare === '0' ? 1 : terraswapPoolInfo.lpShare,
          ) as u<Token<Big>>;

        const withdrawableUst = big(terraswapPoolInfo.ustPoolSize)
          .mul(rewardInfo.bond_amount)
          .div(
            terraswapPoolInfo.lpShare === '0' ? 1 : terraswapPoolInfo.lpShare,
          ) as u<Luna<Big>>;

        const withdrawableValue = withdrawableToken
          .mul(terraswapPoolInfo.tokenPrice)
          .plus(withdrawableUst) as u<Luna<Big>>;

        return {
          symbol: tokenInfo.symbol,
          staked: rewardInfo.bond_amount,
          withdrawableToken,
          withdrawableUst,
          withdrawableValue,
          rewardAmount: rewardInfo.pending_reward,
          rewardAmountValue: (nebInfo
            ? big(rewardInfo.pending_reward).mul(
                nebInfo.terraswapPoolInfo.tokenPrice,
              )
            : big(0)) as u<Luna<Big>>,
          to: `/staking/${tokenAddr}/unstake`,
          apr: getStakingAPR(tokenAddr, terraswapPoolInfo, poolInfo),
        };
      },
    );
  }, [data, nebInfo, getStakingAPR]);

  const stakingsTotal = useMemo(() => {
    return stakings.reduce(
      (total, { rewardAmount, rewardAmountValue, withdrawableValue }) => {
        total.farmValue = total.farmValue.plus(withdrawableValue) as u<
          Luna<Big>
        >;
        total.reward = total.reward.plus(rewardAmount) as u<NEB<Big>>;
        total.rewardValue = total.rewardValue.plus(rewardAmountValue) as u<
          Luna<Big>
        >;
        return total;
      },
      {
        farmValue: big(0) as u<Luna<Big>>,
        reward: big(0) as u<NEB<Big>>,
        rewardValue: big(0) as u<Luna<Big>>,
      },
    );
  }, [stakings]);

  const tableMinWidth = useScreenSizeValue({
    mobile: 700,
    tablet: 900,
    pc: 900,
    monitor: 900,
  });

  const tableButtonSize = useScreenSizeValue<'small' | 'tiny'>({
    mobile: 'tiny',
    tablet: 'small',
    pc: 'small',
    monitor: 'small',
  });

  const startPadding = useScreenSizeValue<`${number}rem`>({
    mobile: '1rem',
    tablet: '1rem',
    pc: '2rem',
    monitor: '2rem',
  });

  const descriptionDisplay = useScreenSizeValue<'horizontal' | 'vertical'>({
    mobile: 'vertical',
    tablet: 'vertical',
    pc: 'horizontal',
    monitor: 'horizontal',
    hook: (w) => (w > 800 && w < 950 ? 'vertical' : null),
  });

  return (
    <HorizontalScrollTable
      className={className}
      minWidth={tableMinWidth}
      startPadding={startPadding}
      endPadding={startPadding}
      headerContents={
        <Table3SectionHeader>
          <h2>Staking</h2>
          <Descriptions
            className="descriptions"
            direction={descriptionDisplay}
            descriptions={[
              {
                label: 'Total Farm Value',
                text: `${formatUTokenWithPostfixUnits(
                  stakingsTotal.farmValue,
                )} Luna`,
              },
              {
                label: 'Total Reward',
                text: `${formatUTokenWithPostfixUnits(
                  stakingsTotal.reward,
                )} NEB`,
              },
              {
                label: 'Total Reward Value',
                text: `${formatUTokenWithPostfixUnits(
                  stakingsTotal.rewardValue,
                )} Luna`,
              },
            ]}
          />
        </Table3SectionHeader>
      }
    >
      <thead>
        <tr>
          <th>
            <span>
              Name
              <br />
              APR
            </span>
          </th>
          <th>
            <span>Staked</span>
          </th>
          <th>
            <span>
              Withdrawable Asset
              <br />
              Value
            </span>
          </th>
          <th>
            <span>
              Reward Amount
              <br />
              Value
            </span>
          </th>
          <th>
            <span>Actions</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {stakings.map(
          ({
            symbol,
            staked,
            withdrawableToken,
            withdrawableUst,
            withdrawableValue,
            rewardAmount,
            rewardAmountValue,
            to,
            apr,
          }) => (
            <tr key={'staking' + symbol}>
              <td>
                <TwoLine
                  text={`${symbol}-Luna LP`}
                  subText={`${formatRate(apr)}%`}
                />
              </td>
              <td>{formatUTokenWithPostfixUnits(staked)} LP</td>
              <td>
                <TwoLine
                  text={`${formatUTokenWithPostfixUnits(
                    withdrawableToken,
                  )} ${symbol} + ${formatUTokenWithPostfixUnits(
                    withdrawableUst,
                  )} Luna`}
                  subText={`${formatUTokenWithPostfixUnits(
                    withdrawableValue,
                  )} Luna`}
                />
              </td>
              <td>
                <TwoLine
                  text={`${formatUTokenWithPostfixUnits(rewardAmount)} NEB`}
                  subText={`${formatUTokenWithPostfixUnits(
                    rewardAmountValue,
                  )} Luna`}
                />
              </td>
              <td>
                <Button
                  size={tableButtonSize}
                  color="border"
                  componentProps={{ component: Link, to }}
                >
                  Unstake
                </Button>
              </td>
            </tr>
          ),
        )}
      </tbody>
    </HorizontalScrollTable>
  );
}

export const Staking = styled(StakingBase)`
  background-color: var(--color-gray14);
  border-radius: 8px;

  td,
  th {
    text-align: right;

    &:first-child {
      text-align: left;
    }
  }

  td {
    &:nth-child(1) {
      font-size: 1.2em;
      font-weight: 500 !important;
      color: var(--color-white92);
    }

    &:nth-child(4) {
      button {
        min-width: 6.5em;

        &:last-child {
          margin-left: 0.9em;
        }
      }
    }
  }

  thead {
    tr {
      th {
        border-bottom: 2px solid var(--color-gray11);
      }
    }
  }

  tbody {
    tr:not(:last-child) {
      td {
        border-bottom: 1px solid var(--color-gray11);
      }
    }
  }
`;
