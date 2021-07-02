import {
  breakpoints,
  DiffSpan,
  HorizontalScrollTable,
  IconAndLabels,
  Search,
  useScreenSizeValue,
} from '@nebula-js/ui';
import { fixHMR } from 'fix-hmr';
import { useQueryBoundInput } from '@terra-dev/use-query-bound-input';
import { MainLayout } from 'components/layouts/MainLayout';
import React, { useCallback, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';

export interface ClustersMainProps {
  className?: string;
}

const data = Array.from(
  { length: Math.floor(Math.random() * 15) + 10 },
  (_, i) => {
    return {
      index: i,
      id: `cluster-${i}`.toUpperCase(),
      name: `New is always better ${i}`,
      nameLowerCase: `New is always better ${i}`.toLowerCase(),
      description: `NIAL ${i}`,
      price: '102.01',
      hr24diff: (i % 3) - 1,
      hr24: '60.78',
      marketCap: '254,100.062',
      volume: '254,100.62',
    };
  },
);

function ClustersMainBase({ className }: ClustersMainProps) {
  const history = useHistory();

  const tableMinWidth = useScreenSizeValue({
    mobile: 700,
    tablet: 1000,
    pc: 1000,
    monitor: 1000,
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
  }, [value]);

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
          {filteredData.map(
            ({
              index,
              id,
              name,
              description,
              price,
              hr24,
              hr24diff,
              marketCap,
              volume,
            }) => (
              <tr key={'row' + index} onClick={() => gotoCluster(id)}>
                <td>
                  <IconAndLabels text={name} subtext={description} />
                </td>
                <td>{price} UST</td>
                <td>
                  <DiffSpan diff={hr24diff}>{hr24}%</DiffSpan>
                </td>
                <td>{marketCap} UST</td>
                <td>{volume} UST</td>
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
