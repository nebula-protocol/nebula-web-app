import { FileCopy } from '@material-ui/icons';
import { Button } from '@nebula-js/ui';
import { Meta } from '@storybook/react';
import React from 'react';
import { CircleSpinner, WaveSpinner } from 'react-spinners-kit';
import styled from 'styled-components';

export default {
  title: 'ui/Button',
} as Meta;

const sizeList = ['normal', 'medium', 'small', 'tiny'] as const;

export const Size_And_Layout = () => {
  return (
    <Container>
      {sizeList.map((size) => (
        <section key={size}>
          <Button size={size}>BUTTON</Button>
          <Button size={size}>
            <FileCopy />
            <span>BUTTON</span>
          </Button>
          <Button size={size}>
            <span>BUTTON</span>
            <FileCopy />
          </Button>
          <Button
            size={size}
            style={{ display: 'flex', justifyContent: 'space-between' }}
          >
            <CircleSpinner size={1} sizeUnit="em" />
            <span>BUTTON</span>
          </Button>
          <Button
            size={size}
            style={{ display: 'flex', justifyContent: 'space-between' }}
          >
            <span>BUTTON</span>
            <WaveSpinner size={1} sizeUnit="em" />
          </Button>
        </section>
      ))}
    </Container>
  );
};

export const Colors = () => {
  return (
    <Container>
      {sizeList.map((size) => (
        <section key={size}>
          <Button size={size} color="paleblue">
            PALEBLUE
          </Button>
          <Button size={size} color="gray">
            <span>GRAY</span>
          </Button>
          <Button size={size} color="dark">
            <span>DARK</span>
          </Button>
          <Button size={size} color="dim">
            <span>DIM</span>
          </Button>
          <Button size={size} color="border">
            <span>BORDER</span>
          </Button>
          <Button size={size} disabled>
            <span>DISABLED</span>
          </Button>
        </section>
      ))}
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  gap: 2rem;

  > section {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  button[data-size='normal'] {
    min-width: 200px;
  }

  button[data-size='medium'] {
    min-width: 150px;
  }

  button[data-size='small'] {
    min-width: 120px;
  }
`;
