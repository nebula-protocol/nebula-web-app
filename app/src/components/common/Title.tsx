import styled from 'styled-components';
import { breakpoints } from '../../@nebula-js/ui';

const Title = styled.h1`
  margin-bottom: 24px;
  display: flex;
  align-items: center;
  @media (max-width: ${breakpoints.tablet.max}px) {
    margin-bottom: 20px;
  }
`;

export { Title };
