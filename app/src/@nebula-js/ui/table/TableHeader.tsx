import styled from 'styled-components';
import { breakpoints } from '../env';

export const TableHeader = styled.div`
  padding: 1.2rem 2rem;

  border-bottom: 1px solid ${({ theme }) => theme.colors.gray11};

  display: flex;
  align-items: center;

  > h2 {
    font-size: 16px !important;
    color: ${({ theme }) => theme.colors.paleblue.main};
  }

  > .buttons {
    flex: 1;

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

  @media (max-width: ${breakpoints.tablet.max}px) {
    padding: 1rem;
  }
`;
