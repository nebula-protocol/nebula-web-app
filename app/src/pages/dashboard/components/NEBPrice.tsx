import { formatToken } from '@libs/formatter';
import { AnimateNumber } from '@libs/ui';
import { useNebPrice } from '@nebula-js/app-provider';
import { Sub } from '@nebula-js/ui';
import { fixHMR } from 'fix-hmr';
import React from 'react';
import styled from 'styled-components';

export interface NEBPriceProps {
  className?: string;
}

function NEBPriceBase({ className }: NEBPriceProps) {
  const nebPrice = useNebPrice();

  return (
    <div className={className}>
      <p className="price">
        <AnimateNumber format={formatToken}>{nebPrice}</AnimateNumber>{' '}
        <Sub>UST</Sub>
      </p>

      {/* TODO: need indexer */}
      {/* <VerticalLabelAndValue
        className="circulating-supply"
        label="NEB CIRCULATING SUPPLY"
      >
        <s>100,000.123 NEB</s>
      </VerticalLabelAndValue> */}
    </div>
  );
}

const StyledNEBPrice = styled(NEBPriceBase)`
  .price {
    font-size: var(--font-size32);
  }

  .diff {
    font-size: var(--font-size12);
  }

  .circulating-supply {
    margin-top: 3.3em;

    font-size: var(--font-size12);

    h4 {
      font-size: var(--font-size12);
      font-weight: 500;
      color: var(--color-white6);

      margin-bottom: 0.28571429em;
    }
  }
`;

export const NEBPrice = fixHMR(StyledNEBPrice);
