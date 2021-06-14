import React, { DetailedHTMLProps, HTMLAttributes } from 'react';
import styled from 'styled-components';

export interface CarouselProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  slide: number;
}

function CarouselBase({ slide, ...divProps }: CarouselProps) {
  return (
    <Container>
      <div
        {...divProps}
        style={{ transform: `translateX(${slide * -100}%)` }}
      />
    </Container>
  );
}

const Container = styled.div`
  overflow: hidden;
`;

export const Carousel = styled(CarouselBase)`
  transition: transform 0.4s ease-in-out;

  display: flex;

  > * {
    min-width: 100%;
    max-width: 100%;
  }
`;
