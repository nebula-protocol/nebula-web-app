import { List, ViewModule } from '@material-ui/icons';
import { breakpoints, EmptyButton, Search, NativeSelect } from '@nebula-js/ui';
import { useClustersInfoListQuery } from '@nebula-js/app-provider';
import { useLocalStorage } from '@libs/use-local-storage';
import { useQueryBoundInput } from '@libs/use-query-bound-input';
import { MainLayout } from 'components/layouts/MainLayout';
import { fixHMR } from 'fix-hmr';
import React, { useCallback, useMemo, useState, ChangeEvent } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { ClustersCards } from './components/ClustersCards';
import { ClustersTable } from './components/ClustersTable';
import { ClusterView, toClusterView } from './models/clusters';

enum SortBy {
  NameASC = 'Name (A to Z)',
  NameDESC = 'Name (Z toA)',
  PriceASC = 'Price (Low to High)',
  PriceDESC = 'Price (High to Low)',
  MCapASC = 'Market Cap (Low to High)',
  MCapDESC = 'Market Cap (High to Low)',
  ProvidedASC = 'Total Provided (Low to High)',
  ProvidedDESC = 'Total Provided (High to Low)',
  PremiumASC = 'Premium (Low to High)',
  PremiumDESC = 'Premium (High to Low)',
}

export interface ClustersMainProps {
  className?: string;
}

function ClustersMainBase({ className }: ClustersMainProps) {
  const { value, updateValue } = useQueryBoundInput({ queryParam: 'search' });

  const history = useHistory();

  // ---------------------------------------------
  // queries
  // ---------------------------------------------
  const { data: infoList = [] } = useClustersInfoListQuery();

  // ---------------------------------------------
  // states
  // ---------------------------------------------
  const [sortBy, setSortBy] = useState(SortBy.MCapDESC);

  // ---------------------------------------------
  // logics
  // ---------------------------------------------
  const data = useMemo<ClusterView[]>(() => {
    return infoList.map((info) => toClusterView(info));
  }, [infoList]);

  const sortedData = useMemo(() => {
    let x = data;

    switch (sortBy) {
      case SortBy.NameASC:
        x = x.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case SortBy.NameDESC:
        x = x.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case SortBy.PriceASC:
        x = x.sort((a, b) => a.prices.clusterPrice.cmp(b.prices.clusterPrice));
        break;
      case SortBy.PriceDESC:
        x = x.sort((a, b) => b.prices.clusterPrice.cmp(a.prices.clusterPrice));
        break;
      case SortBy.ProvidedASC:
        x = x.sort((a, b) => a.provided.cmp(b.provided));
        break;
      case SortBy.ProvidedDESC:
        x = x.sort((a, b) => b.provided.cmp(a.provided));
        break;
      case SortBy.PremiumASC:
        x = x.sort((a, b) =>
          a.prices.premium.abs().cmp(b.prices.premium.abs()),
        );
        break;
      case SortBy.PremiumDESC:
        x = x.sort((a, b) =>
          b.prices.premium.abs().cmp(a.prices.premium.abs()),
        );
        break;
      case SortBy.MCapASC:
        x = x.sort((a, b) => a.marketCap.cmp(b.marketCap));
        break;
      case SortBy.MCapDESC:
      default:
        x = x.sort((a, b) => b.marketCap.cmp(a.marketCap));
        break;
    }

    return x.sort((a, b) => Number(b.isActive) - Number(a.isActive));
  }, [data, sortBy]);

  const filteredData = useMemo(() => {
    if (!value || value.trim().length === 0) {
      return sortedData;
    }

    const tokens = value.split(' ');

    return sortedData.filter(({ nameLowerCase }) => {
      return tokens.some((token) => {
        return nameLowerCase.indexOf(token) > -1;
      });
    });
  }, [sortedData, value]);

  // ---------------------------------------------
  // callbacks
  // ---------------------------------------------
  const gotoCluster = useCallback(
    (clusterId: string) => {
      history.push(`/clusters/${clusterId}`);
    },
    [history],
  );

  const handleSort = ({ target }: ChangeEvent<HTMLSelectElement>) => {
    const newVal = target.value;

    const selectedSort = Object.values(SortBy).find(
      (sortValue) => sortValue === newVal,
    );

    if (selectedSort) {
      setSortBy(selectedSort);
    } else {
      throw Error("Can't match any sort");
    }
  };

  // ---------------------------------------------
  // presentation
  // ---------------------------------------------
  const [view, setView] = useLocalStorage<'table' | 'card'>(
    '__nebula_clusters_view__',
    () => 'table',
  );

  return (
    <MainLayout className={className}>
      <h1>Clusters</h1>

      <Search
        className="search"
        type="text"
        placeholder="Search cluster name..."
        value={value ?? ''}
        onChange={({ target }) =>
          updateValue(target.value.length > 0 ? target.value : null)
        }
        selectInput={
          <div className="select-form">
            <span>Sort by</span>
            <SortSelect fullWidth value={sortBy} onChange={handleSort}>
              {Object.values(SortBy).map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </SortSelect>
          </div>
        }
      >
        <ViewIcons>
          <EmptyButton
            role="radio"
            onClick={() => setView('table')}
            aria-checked={view === 'table'}
          >
            <List />
          </EmptyButton>

          <EmptyButton
            role="radio"
            onClick={() => setView('card')}
            aria-checked={view === 'card'}
          >
            <ViewModule />
          </EmptyButton>
        </ViewIcons>
      </Search>

      {view === 'card' ? (
        <ClustersCards clusters={filteredData} onClusterClick={gotoCluster} />
      ) : (
        <ClustersTable clusters={filteredData} onClusterClick={gotoCluster} />
      )}
    </MainLayout>
  );
}

const SortSelect = styled(NativeSelect)`
  height: 3rem;
  padding-right: 1em;

  .MuiNativeSelect-icon {
    right: 0.5em;
  }
`;

const ViewIcons = styled.div`
  display: flex;
  align-items: center;
  gap: 1em;

  svg {
    font-size: 20px;
  }

  button {
    color: var(--color-gray34);

    &[aria-checked='true'] {
      color: var(--color-paleblue);
    }
  }
`;

const StyledClustersMain = styled(ClustersMainBase)`
  h1 {
    margin-bottom: 24px;
  }

  .search {
    margin-bottom: 16px;
  }

  .select-form {
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;

    > span {
      white-space: nowrap;
      margin-right: 1em;
      color: var(--color-white44);
    }
  }

  @media (max-width: ${breakpoints.tablet.max}px) {
    h1 {
      margin-bottom: 20px;
    }

    .select-form {
      flex-direction: column;
      gap: 0.5em;
      align-items: flex-start;
    }
  }
`;

export default fixHMR(StyledClustersMain);
