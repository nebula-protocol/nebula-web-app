import styled from 'styled-components';
import { breakpoints } from '../env';

export const Table3SectionHeader = styled.div`
  padding: 1rem 2rem;

  border-bottom: 1px solid var(--color-gray2);

  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: auto auto;
  grid-gap: 1em;
  align-items: center;

  > h2 {
    grid-column: 1/3;
    grid-row: 1;

    font-size: 16px !important;
    color: var(--color-paleblue);
  }

  > .buttons {
    font-size: 12px;

    display: flex;
    justify-content: flex-end;
    gap: 1em;

    button {
      color: var(--color-paleblue);

      &:hover {
        color: hsl(
          var(--color-paleblue-h),
          var(--color-paleblue-s),
          calc(var(--color-paleblue-l) + 15%)
        );
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
