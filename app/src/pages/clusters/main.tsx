import { ArrowDropDown, ArrowDropUp } from '@material-ui/icons';
import { HorizontalScrollTable, SearchInput } from '@nebula-js/ui';
import { useQueryBoundInput } from '@nebula-js/use-query-bound-input';
import { MainLayout } from 'components/layouts/MainLayout';
import React, { useMemo } from 'react';
import styled from 'styled-components';

export interface ClustersMainProps {
  className?: string;
}

const data = Array.from({ length: Math.floor(Math.random() * 30) }, (_, i) => {
  const diff = i % 2 === 0;

  return {
    index: i,
    name: `New is always better ${i}`,
    nameLowerCase: `New is always better ${i}`.toLowerCase(),
    description: `NIAL ${i}`,
    price: '102.01',
    hr24diff: diff ? 'up' : 'down',
    hr24: '60.78',
    marketCap: '254,100.062',
    volume: '254,100.62',
  };
});

function ClustersMainBase({ className }: ClustersMainProps) {
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

  return (
    <MainLayout className={className}>
      <h1>Clusters</h1>

      <SearchInput
        className="search"
        type="text"
        value={value ?? ''}
        onChange={({ target }) =>
          updateValue(target.value.length > 0 ? target.value : null)
        }
      />

      <Table minWidth={1000}>
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
              name,
              description,
              price,
              hr24,
              hr24diff,
              marketCap,
              volume,
            }) => (
              <tr key={'row' + index}>
                <td>
                  <i />
                  <div>
                    <h4>{name}</h4>
                    <p>{description}</p>
                  </div>
                </td>
                <td>{price} UST</td>
                <td data-diff={hr24diff}>
                  {hr24diff === 'up' ? <ArrowDropUp /> : <ArrowDropDown />}{' '}
                  {hr24}%
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
  background-color: ${({ theme }) => theme.colors.gray14};
  border-radius: 8px;

  td,
  th {
    text-align: right;

    &:first-child {
      text-align: left;
    }
  }

  td {
    &:first-child {
      display: flex;
      align-items: center;

      i {
        display: inline-block;
        width: 2.2em;
        height: 2.2em;
        background-color: ${({ theme }) => theme.colors.gray34};
        border-radius: 50%;

        margin-right: 0.9em;
      }

      h4 {
        font-weight: 500;
        color: ${({ theme }) => theme.colors.white92};
      }

      p {
        font-size: 0.9em;
        font-weight: 500;
        color: ${({ theme }) => theme.colors.white44};
      }
    }

    svg {
      font-size: 1em;
      transform: translateY(2px);
    }
  }

  thead {
    tr {
      th {
        border-bottom: 2px solid ${({ theme }) => theme.colors.gray11};
      }
    }
  }

  tbody {
    tr:not(:last-child) {
      td {
        border-bottom: 1px solid ${({ theme }) => theme.colors.gray11};
      }
    }
  }
`;

export default styled(ClustersMainBase)`
  h1 {
    margin-bottom: 24px;
  }

  .search {
    margin-bottom: 12px;
  }
`;
