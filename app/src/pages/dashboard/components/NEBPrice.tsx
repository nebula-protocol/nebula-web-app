import { DiffSpan } from '@nebula-js/ui';
import React from 'react';
import styled from 'styled-components';

export interface NEBPriceProps {
  className?: string;
}

function NEBPriceBase({ className }: NEBPriceProps) {
  return (
    <div className={className}>
      <p>
        12.595 <span>UST</span>
      </p>
      <p>
        <DiffSpan diff={123.12} translateIconY="0.15em">
          123.12%
        </DiffSpan>
      </p>

      <section>
        <h4>NEB CIRCULATING SUPPLY</h4>
        <p>100,000.123 NEB</p>
      </section>
    </div>
  );
}

export const NEBPrice = styled(NEBPriceBase)`
  > :nth-child(1) {
    font-size: 2.2em;

    span {
      font-size: 12px;
    }
  }

  > :nth-child(2) {
    font-size: 12px;
  }

  > :nth-child(3) {
    margin-top: 3.3em;

    font-size: 12px;

    h4 {
      font-size: 1em;
      font-weight: 500;
      color: ${({ theme }) => theme.colors.white44};
    }
  }
`;
