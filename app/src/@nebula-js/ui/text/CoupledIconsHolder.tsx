import React, { DetailedHTMLProps, HTMLAttributes } from 'react';
import styled from 'styled-components';

export interface CoupledIconsHolderProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  radiusEm?: number;
}

const defaultRadiusEm = 1;

function CoupledIconsHolderBase({
  radiusEm,
  ...divProps
}: CoupledIconsHolderProps) {
  return <div {...divProps} />;
}

export const CoupledIconsHolder = styled(CoupledIconsHolderBase)`
  display: flex;
  flex-direction: row-reverse;
  justify-content: center;

  > img {
    margin: 0;

    width: ${({ radiusEm = defaultRadiusEm }) => radiusEm * 2}em;
    height: ${({ radiusEm = defaultRadiusEm }) => radiusEm * 2}em;

    font-size: ${({ radiusEm = defaultRadiusEm }) => radiusEm}em;

    display: grid;
    place-content: center;

    &:not(:first-child) {
      margin-right: -${({ radiusEm = defaultRadiusEm }) => radiusEm / 2}em;
    }
  }
`;
