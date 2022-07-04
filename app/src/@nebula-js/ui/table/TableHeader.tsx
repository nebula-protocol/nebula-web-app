import styled from 'styled-components';
import { breakpoints } from '../env';

export const TableHeader = styled.div`
  padding: 1.2rem 2rem;

  border-bottom: 1px solid var(--color-gray2);

  display: flex;
  align-items: center;

  > h2 {
    font-size: 16px !important;
    color: var(--color-paleblue);
  }

  > .buttons {
    flex: 1;

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

  @media (max-width: ${breakpoints.tablet.max}px) {
    padding: 1rem;
  }
`;
