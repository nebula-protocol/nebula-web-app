import { breakpoints } from '../env';
import styled from 'styled-components';

export const IconSeparator = styled.div`
  display: grid;
  place-content: center;

  height: 4em;

  svg {
    font-size: 1.5em;
    width: 1em;
  }

  @media (max-width: ${breakpoints.mobile.max}px) {
    height: 3.1em;

    svg {
      font-size: 1.3em;
    }
  }
`;
