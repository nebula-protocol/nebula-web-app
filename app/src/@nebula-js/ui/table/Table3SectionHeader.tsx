import styled from 'styled-components';
import { breakpoints } from '../env';

export const Table3SectionHeader = styled.div`
  padding: 1rem 2rem;

  border-bottom: 1px solid ${({ theme }) => theme.colors.gray11};

  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: auto auto;
  grid-gap: 1em;
  align-items: center;

  > h2 {
    grid-column: 1/3;
    grid-row: 1;

    font-size: 16px !important;
    color: ${({ theme }) => theme.colors.paleblue.main};
  }

  > .buttons {
    font-size: 12px;

    display: flex;
    justify-content: flex-end;
    gap: 1em;

    button {
      color: ${({ theme }) => theme.colors.paleblue.main};

      &:hover {
        color: ${({ theme }) => theme.colors.paleblue.light};
      }
    }
  }

  > .descriptions {
    grid-column: 1/2;
    grid-row: 2;
  }

  @media (max-width: ${breakpoints.tablet.max}px) {
    padding: 1rem;

    grid-template-columns: auto 1fr;
    grid-template-rows: auto auto;

    > h2 {
      grid-column: 1;
      grid-row: 1;
    }

    > .buttons {
      grid-column: 2;
      grid-row: 1;

      flex-direction: column;
      align-items: flex-end;
    }

    > .descriptions {
      grid-column: 1/3;
      grid-row: 2;
    }
  }
`;
