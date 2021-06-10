import { Meta } from '@storybook/react';
import React from 'react';
import styled from 'styled-components';
import { Button } from '../Button';

export default {
  title: 'ui/Button',
} as Meta;

export const Size = () => {
  return (
    <Container>
      <Button size="normal" style={{ minWidth: 150 }}>
        Normal
      </Button>
      <Button size="medium" style={{ minWidth: 120 }}>
        Medium
      </Button>
      <Button size="small" style={{ minWidth: 80 }}>
        Small
      </Button>
      <Button size="tiny">Tiny</Button>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1em;
`;
