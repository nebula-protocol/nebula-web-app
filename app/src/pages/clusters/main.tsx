import { List, ViewModule } from '@material-ui/icons';
import { breakpoints, EmptyButton, Search } from '@nebula-js/ui';
import { useClustersInfoListQuery } from '@nebula-js/webapp-provider';
import { useLocalStorage } from '@libs/use-local-storage';
import { useQueryBoundInput } from '@libs/use-query-bound-input';
import { MainLayout } from 'components/layouts/MainLayout';
import { fixHMR } from 'fix-hmr';
import React, { useCallback, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { ClustersCards } from './components/ClustersCards';
import { ClustersTable } from './components/ClustersTable';
import { ClusterView, toClusterView } from './models/clusters';

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

  const data = useMemo<ClusterView[]>(() => {
    return infoList.map((info) => toClusterView(info));
  }, [infoList]);

  // ---------------------------------------------
  // computes
  // ---------------------------------------------
  const filteredData = useMemo(() => {
    if (!value || value.trim().length === 0) {
      return data;
    }

    const tokens = value.split(' ');

    return data.filter(({ nameLowerCase }) => {
      return tokens.some((token) => {
        return nameLowerCase.indexOf(token) > -1;
      });
    });
  }, [data, value]);

  // ---------------------------------------------
  // callbacks
  // ---------------------------------------------
  const gotoCluster = useCallback(
    (clusterId: string) => {
      history.push(`/clusters/${clusterId}`);
    },
    [history],
  );

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
        value={value ?? ''}
        onChange={({ target }) =>
          updateValue(target.value.length > 0 ? target.value : null)
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
    margin-bottom: 12px;
  }

  @media (max-width: ${breakpoints.tablet.max}px) {
    h1 {
      margin-bottom: 20px;
    }
  }
`;

export default fixHMR(StyledClustersMain);
