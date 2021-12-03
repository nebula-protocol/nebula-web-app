import { Lock } from '@material-ui/icons';
import React from 'react';
import styled from 'styled-components';
import { NEB } from '../../../@nebula-js/types';

interface Props {
  lockedWeek: number;
  lockedAmount: NEB;
}

const UnstakeLock = ({ lockedWeek, lockedAmount }: Props) => {
  return (
    <Container>
      <BlueLock />
      <p>
        You have NEB token locked, it will be unstakable after locking period
        ends
      </p>
      <Section>
        <div>
          <Label>Remaining lock period</Label>
          <Content>{`${lockedWeek} WEEK`}</Content>
        </div>
        <div>
          <Label>Locked amount</Label>
          <Content>{`${lockedAmount} NEB`}</Content>
        </div>
      </Section>
    </Container>
  );
};

const Container = styled.div`
  text-align: center;
  font-size: var(--font-size14-12);
  > p {
    margin-top: 24px;
    margin-bottom: 40px;
  }
`;

const BlueLock = styled(Lock)`
  font-size: 53px;
  color: var(--color-blue01);
`;

const Label = styled.p`
  color: var(--color-white44);
`;

const Content = styled.p`
  color: var(--color-white80);
`;

const Section = styled.section`
  padding: 20px 24px;
  border-radius: 4px;
  background-color: var(--color-gray14);
  display: flex;
  flex-direction: column;
  gap: 16px;
  > div {
    display: flex;
    justify-content: space-between;
    gap: 16px;
  }
`;

export { UnstakeLock };
