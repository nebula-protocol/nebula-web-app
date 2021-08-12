import { formatTokenWithPostfixUnits } from '@nebula-js/notation';
import { u, UST } from '@nebula-js/types';
import {
  breakpoints,
  Button,
  CoupledIconsHolder,
  HorizontalScrollTable,
  Search,
  useScreenSizeValue,
} from '@nebula-js/ui';
import {
  useNEBPoolQuery,
  useStakingPoolInfoListQuery,
} from '@nebula-js/webapp-provider';
import { useQueryBoundInput } from '@terra-dev/use-query-bound-input';
import big, { Big } from 'big.js';
import { MainLayout } from 'components/layouts/MainLayout';
import { fixHMR } from 'fix-hmr';
import React, { useCallback, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

export interface StakingMainProps {
  className?: string;
}

function StakingMainBase({ className }: StakingMainProps) {
  const history = useHistory();

  const { data: nebPool } = useNEBPoolQuery();

  const { data: poolInfoList = [] } = useStakingPoolInfoListQuery();

  const data = useMemo(() => {
    return nebPool
      ? poolInfoList.map(
          (
            {
              poolInfo,
              terraswapPool,
              terraswapPoolInfo,
              tokenInfo,
              tokenAddr,
              terraswapPair,
            },
            i,
          ) => {
            const liquidityValue = big(
              big(nebPool.terraswapPoolInfo.tokenPrice).mul(
                terraswapPoolInfo.tokenPoolSize,
              ),
            ).plus(terraswapPoolInfo.ustPoolSize) as u<UST<Big>>;

            const totalStaked = liquidityValue.mul(
              big(poolInfo.total_bond_amount).div(
                +terraswapPool.total_share === 0
                  ? 1
                  : terraswapPool.total_share,
              ),
            ) as u<UST<Big>>;

            return {
              index: i,
              id: tokenAddr,
              name: `${tokenInfo.symbol}-UST LP`,
              nameLowerCase: `${tokenInfo.symbol}-UST LP`.toLowerCase(),
              apr: '123.12',
              totalStaked,
            };
          },
        )
      : [];
  }, [nebPool, poolInfoList]);

  const tableButtonSize = useScreenSizeValue<'small' | 'tiny'>({
    mobile: 'tiny',
    tablet: 'small',
    pc: 'small',
    monitor: 'small',
  });

  const tableMinWidth = useScreenSizeValue({
    mobile: 600,
    tablet: 900,
    pc: 900,
    monitor: 900,
  });

  const { value, updateValue } = useQueryBoundInput({ queryParam: 'search' });

  const filteredData = useMemo(() => {
    if (!value || value.length === 0) {
      return data;
    }

    const tokens = value.split(' ');

    return data.filter(({ nameLowerCase }) => {
      return tokens.some((token) => {
        return nameLowerCase.indexOf(token) > -1;
      });
    });
  }, [value, data]);

  const gotoCluster = useCallback(
    (stakeId: string, page: 'stake' | 'unstake') => {
      history.push(`/staking/${stakeId}/${page}`);
    },
    [history],
  );

  return (
    <MainLayout className={className}>
      <h1>Staking</h1>

      <Search
        className="search"
        type="text"
        value={value ?? ''}
        onChange={({ target }) =>
          updateValue(target.value.length > 0 ? target.value : null)
        }
      />

      <Table minWidth={tableMinWidth}>
        <thead>
          <tr>
            <th>
              <span>Name</span>
            </th>
            <th>
              <span>APR</span>
            </th>
            <th>
              <span>Total Staked</span>
            </th>
            <th />
          </tr>
        </thead>

        <tbody>
          {filteredData.map(({ index, id, name, apr, totalStaked }) => (
            <tr key={'row' + index}>
              <td>
                <CoupledIconsHolder radiusEm={1.1}>
                  <figure />
                  <figure />
                </CoupledIconsHolder>
                {name}
              </td>
              <td>
                <s>{apr}%</s>
              </td>
              <td>${formatTokenWithPostfixUnits(totalStaked)}</td>
              <td>
                <Button
                  size={tableButtonSize}
                  color="paleblue"
                  onClick={() => gotoCluster(id, 'stake')}
                >
                  Stake
                </Button>
                <Button
                  size={tableButtonSize}
                  color="border"
                  onClick={() => gotoCluster(id, 'unstake')}
                >
                  Unstake
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </MainLayout>
  );
}

const Table = styled(HorizontalScrollTable)`
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
      display: flex;
      align-items: center;
      gap: 0.6em;

      font-weight: 500 !important;

      figure:nth-of-type(1) {
        border: 1px solid var(--color-gray34);
      }

      figure:nth-of-type(2) {
        background-color: var(--color-gray34);
      }
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

const StyledStakingMain = styled(StakingMainBase)`
  h1 {
    margin-bottom: 24px;
  }

  .search {
    margin-bottom: 12px;
  }

  @media (max-width: ${breakpoints.tablet.max}px) {
    h1 {
      margin-bottom: 20px;
    }
  }
`;

export default fixHMR(StyledStakingMain);
