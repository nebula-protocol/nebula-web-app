import { formatRate, formatUTokenDecimal2 } from '@nebula-js/notation';
import { Rate, u, UST } from '@nebula-js/types';
import {
  breakpoints,
  DiffSpan,
  HorizontalScrollTable,
  IconAndLabels,
  Search,
  useScreenSizeValue,
} from '@nebula-js/ui';
import { getAssetAmounts } from '@nebula-js/webapp-fns';
import { useClustersInfoListQuery } from '@nebula-js/webapp-provider';
import { sum, vectorMultiply } from '@terra-dev/big-math';
import { useQueryBoundInput } from '@terra-dev/use-query-bound-input';
import big, { Big } from 'big.js';
import { MainLayout } from 'components/layouts/MainLayout';
import { fixHMR } from 'fix-hmr';
import React, { useCallback, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

export interface ClustersMainProps {
  className?: string;
}

interface TableItem {
  index: number;
  id: string;
  name: string;
  nameLowerCase: string;
  price: u<UST<Big>>;
  hr24: Rate<Big>;
  hr24diff: Rate<Big>;
  totalProvided: u<UST<Big>>;
  premium: Rate<Big>;
  marketCap: u<UST<Big>>;
  volume: u<UST<Big>>;
}

function ClustersMainBase({ className }: ClustersMainProps) {
  const { data: infoList = [] } = useClustersInfoListQuery();

  console.log('main.tsx..ClustersMainBase()', infoList);

  //const { assetTokens } = useNebulaWebapp();

  const tableItems = useMemo<TableItem[]>(() => {
    return infoList.map(
      ({ clusterState, clusterConfig, terraswapPair, terraswapPool }, i) => {
        const { token, nativeToken } = getAssetAmounts(terraswapPool.assets);

        if (big(token).eq(0) || big(nativeToken).eq(0)) {
          return {
            index: i,
            id: clusterState.cluster_contract_address,
            name: clusterConfig.config.name,
            nameLowerCase: clusterConfig.config.name.toLowerCase(),
            price: big(0) as u<UST<Big>>,
            hr24: big(0.5) as Rate<Big>,
            hr24diff: big(0.5) as Rate<Big>,
            marketCap: big(0) as u<UST<Big>>,
            totalProvided: big(0) as u<UST<Big>>,
            premium: big(0) as Rate<Big>,
            volume: big(111) as u<UST<Big>>,
          };
        }

        const price = big(nativeToken).div(token) as u<UST<Big>>;
        const marketCap = big(clusterState.outstanding_balance_token).mul(
          price,
        ) as u<UST<Big>>;
        const totalProvided = sum(
          ...vectorMultiply(clusterState.prices, clusterState.inv),
        ) as u<UST<Big>>;
        const premium = (
          totalProvided.eq(0)
            ? big(0)
            : big(big(marketCap).minus(totalProvided)).div(totalProvided)
        ) as Rate<Big>;

        return {
          index: i,
          id: clusterState.cluster_contract_address,
          name: clusterConfig.config.name,
          nameLowerCase: clusterConfig.config.name.toLowerCase(),
          price,
          hr24: big(0.5) as Rate<Big>,
          hr24diff: big(0.5) as Rate<Big>,
          marketCap,
          totalProvided,
          premium,
          volume: big(111) as u<UST<Big>>,
        };
      },
    );
  }, [infoList]);

  const history = useHistory();

  const tableMinWidth = useScreenSizeValue({
    mobile: 700,
    tablet: 1000,
    pc: 1000,
    monitor: 1000,
  });

  const { value, updateValue } = useQueryBoundInput({ queryParam: 'search' });

  const filteredTableItems = useMemo(() => {
    if (!value || value.trim().length === 0) {
      return tableItems;
    }

    const tokens = value.split(' ');

    return tableItems.filter(({ nameLowerCase }) => {
      return tokens.some((token) => {
        return nameLowerCase.indexOf(token) > -1;
      });
    });
  }, [tableItems, value]);

  const gotoCluster = useCallback(
    (clusterId: string) => {
      history.push(`/clusters/${clusterId}`);
    },
    [history],
  );

  return (
    <MainLayout className={className}>
      <h1>Clusters</h1>

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
              <span>Cluster</span>
            </th>
            <th>
              <span>Price</span>
            </th>
            <th>
              <span>24HR</span>
            </th>
            <th>
              <span>Market Cap</span>
            </th>
            <th>
              <span>Volume</span>
            </th>
          </tr>
        </thead>

        <tbody>
          {filteredTableItems.map(
            ({
              index,
              id,
              name,
              nameLowerCase,
              price,
              hr24,
              hr24diff,
              marketCap,
              volume,
              premium,
              totalProvided,
            }) => (
              <tr key={'row' + index} onClick={() => gotoCluster(id)}>
                <td>
                  <IconAndLabels text={name} subtext={'TODO'} />
                </td>
                <td>{formatUTokenDecimal2(price)} UST</td>
                <td>
                  <DiffSpan diff={hr24diff}>{formatRate(hr24)}%</DiffSpan>
                </td>
                <td>{formatUTokenDecimal2(marketCap)} UST</td>
                <td>{formatUTokenDecimal2(volume)} UST</td>
              </tr>
            ),
          )}
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
    svg {
      font-size: 1em;
      transform: translateY(2px);
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
    tr {
      cursor: pointer;

      &:hover {
        background-color: var(--color-gray22);
      }
    }

    tr:not(:last-child) {
      td {
        border-bottom: 1px solid var(--color-gray11);
      }
    }
  }
`;

const StyledClustersMain = styled(ClustersMainBase)`
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

export default fixHMR(StyledClustersMain);
