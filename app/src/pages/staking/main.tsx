import { List, ViewModule } from '@material-ui/icons';
import { breakpoints, EmptyButton, Search } from '@nebula-js/ui';
import {
  useNEBPoolQuery,
  useStakingPoolInfoListQuery,
} from '@nebula-js/webapp-provider';
import { useLocalStorage } from '@libs/use-local-storage';
import { useQueryBoundInput } from '@libs/use-query-bound-input';
import { MainLayout } from 'components/layouts/MainLayout';
import { fixHMR } from 'fix-hmr';
import { StakingCards } from 'pages/staking/components/StakingCards';
import { StakingTable } from 'pages/staking/components/StakingTable';
import { toStakingView } from 'pages/staking/models/staking';
import React, { useMemo } from 'react';
import styled from 'styled-components';

export interface StakingMainProps {
  className?: string;
}

function StakingMainBase({ className }: StakingMainProps) {
  const { value, updateValue } = useQueryBoundInput({ queryParam: 'search' });

  // ---------------------------------------------
  // queries
  // ---------------------------------------------
  const { data: nebPool } = useNEBPoolQuery();

  const { data: poolInfoList = [] } = useStakingPoolInfoListQuery();

  // ---------------------------------------------
  // computes
  // ---------------------------------------------
  const data = useMemo(() => {
    return toStakingView(nebPool, poolInfoList);
  }, [nebPool, poolInfoList]);

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

  // ---------------------------------------------
  // presentation
  // ---------------------------------------------
  const [view, setView] = useLocalStorage<'table' | 'card'>(
    '__nebula_staking_view__',
    () => 'table',
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
        <StakingCards staking={filteredData} />
      ) : (
        <StakingTable staking={filteredData} />
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
