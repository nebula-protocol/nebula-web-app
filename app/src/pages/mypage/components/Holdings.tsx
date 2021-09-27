import { sum } from '@libs/big-math';
import {
  formatTokenWithPostfixUnits,
  formatUTokenWithPostfixUnits,
} from '@libs/formatter';
import { useMypageHoldingsQuery, useNebulaApp } from '@nebula-js/app-provider';
import { SendIcon } from '@nebula-js/icons';
import { u, UST } from '@nebula-js/types';
import {
  Button,
  Descriptions,
  EmptyLink,
  HorizontalScrollTable,
  Table3SectionHeader,
  TwoLine,
  useScreenSizeValue,
} from '@nebula-js/ui';
import big, { Big } from 'big.js';
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

export interface HoldingsProps {
  className?: string;
}

function HoldingsBase({ className }: HoldingsProps) {
  const { contractAddress } = useNebulaApp();

  const { data = [] } = useMypageHoldingsQuery();

  const holdings = useMemo(() => {
    return data
      .filter(({ tokenBalance }) => big(tokenBalance.balance).gt(0))
      .map(
        ({
          tokenAddr,
          tokenInfo,
          tokenBalance,
          terraswapPoolInfo,
          clusterState,
        }) => {
          const price = terraswapPoolInfo.tokenPrice;
          const balance = tokenBalance.balance;
          const value = big(balance).mul(price) as u<UST<Big>>;

          return {
            symbol: tokenInfo.symbol,
            name: tokenInfo.name,
            price,
            balance,
            value,
            to:
              tokenAddr === contractAddress.cw20.NEB
                ? `/gov/trade`
                : `/clusters/${clusterState?.cluster_contract_address}/buy`,
          };
        },
      );
  }, [contractAddress.cw20.NEB, data]);

  const totalHoldingsValue = useMemo(() => {
    return sum(...holdings.map(({ value }) => value)) as u<UST<Big>>;
  }, [holdings]);

  const tableMinWidth = useScreenSizeValue({
    mobile: 600,
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
  });

  return (
    <HorizontalScrollTable
      className={className}
      minWidth={tableMinWidth}
      startPadding={startPadding}
      endPadding={startPadding}
      headerContents={
        <Table3SectionHeader>
          <h2>Holdings</h2>
          <div className="buttons">
            <EmptyLink
              component={Link}
              to="/send"
              style={{ color: 'var(--color-paleblue)' }}
            >
              <SendIcon style={{ marginRight: '0.5em' }} /> Send
            </EmptyLink>
          </div>
          <Descriptions
            className="descriptions"
            direction={descriptionDisplay}
            descriptions={[
              {
                label: 'Total Holdings Value',
                text: `${formatUTokenWithPostfixUnits(totalHoldingsValue)} UST`,
              },
            ]}
          />
        </Table3SectionHeader>
      }
    >
      <thead>
        <tr>
          <th>
            <span>Ticker</span>
          </th>
          <th>
            <span>Price</span>
          </th>
          <th>
            <span>Balance</span>
          </th>
          <th>
            <span>Value</span>
          </th>
          <th>
            <span>Actions</span>
          </th>
        </tr>
      </thead>
      <tbody>
        {holdings.map(({ symbol, name, price, balance, value, to }) => (
          <tr key={'holdings' + symbol}>
            <td>
              <TwoLine text={symbol} subText={name} />
            </td>
            <td>{formatTokenWithPostfixUnits(price)} UST</td>
            <td>{formatUTokenWithPostfixUnits(balance)}</td>
            <td>{formatUTokenWithPostfixUnits(value)} UST</td>
            <td>
              <Button
                size={tableButtonSize}
                color="border"
                componentProps={{ component: Link, to }}
              >
                Trade
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </HorizontalScrollTable>
  );
}

export const Holdings = styled(HoldingsBase)`
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
