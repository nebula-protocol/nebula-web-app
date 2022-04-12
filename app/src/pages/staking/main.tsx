import { List, ViewModule } from '@material-ui/icons';
import { breakpoints, EmptyButton, Search, NativeSelect } from '@nebula-js/ui';
import {
  useDistributionScheduleQuery,
  useNEBPoolQuery,
  useStakingPoolInfoListQuery,
} from '@nebula-js/app-provider';
import { useLocalStorage } from '@libs/use-local-storage';
import { useQueryBoundInput } from '@libs/use-query-bound-input';
import { MainLayout } from 'components/layouts/MainLayout';
import { fixHMR } from 'fix-hmr';
import { StakingCards } from 'pages/staking/components/StakingCards';
import { StakingTable } from 'pages/staking/components/StakingTable';
import { toStakingView } from 'pages/staking/models/staking';
import React, { useMemo, useState, ChangeEvent } from 'react';
import styled from 'styled-components';
import big from 'big.js';

enum SortBy {
  NameASC = 'Name (A to Z)',
  NameDESC = 'Name (Z to A)',
  AprASC = 'APR (Low to High)',
  AprDESC = 'APR (High to Low)',
}

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
  const { data: distributionSchedule } = useDistributionScheduleQuery();

  // ---------------------------------------------
  // states
  // ---------------------------------------------
  const [sortBy, setSortBy] = useState(SortBy.AprDESC);

  // ---------------------------------------------
  // logics
  // ---------------------------------------------
  const data = useMemo(() => {
    return toStakingView(nebPool, poolInfoList, distributionSchedule);
  }, [nebPool, poolInfoList, distributionSchedule]);

  const sortedData = useMemo(() => {
    let x = data;

    switch (sortBy) {
      case SortBy.NameASC:
        x = x.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case SortBy.NameDESC:
        x = x.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case SortBy.AprASC:
        x = x.sort((a, b) => big(a.apr).cmp(b.apr));
        break;
      case SortBy.AprDESC:
      default:
        x = x.sort((a, b) => big(b.apr).cmp(a.apr));
        break;
    }

    return x.sort((a, b) => Number(b.isActive) - Number(a.isActive));
  }, [data, sortBy]);

  const filteredData = useMemo(() => {
    if (!value || value.length === 0) {
      return sortedData;
    }

    const token = value.trim().toLocaleLowerCase();

    return sortedData.filter(({ nameLowerCase }) => {
      return nameLowerCase.indexOf(token) > -1;
    });
  }, [sortedData, value]);

  // ---------------------------------------------
  // callbacks
  // ---------------------------------------------

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
    '__nebula_staking_view__',
    () => 'table',
  );

  return (
    <MainLayout className={className}>
      <h1>Staking</h1>

      <Search
        className="search"
        type="text"
        placeholder="Search liquidity pool name..."
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
        <StakingCards staking={filteredData} />
      ) : (
        <StakingTable staking={filteredData} />
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

const StyledStakingMain = styled(StakingMainBase)`
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

export default fixHMR(StyledStakingMain);
