import { useTerraswapPoolQuery } from '@libs/app-provider';
import { formatToken } from '@libs/formatter';
import { AnimateNumber } from '@libs/ui';
import { useNebulaApp } from '@nebula-js/app-provider';
import { NEB } from '@nebula-js/types';
import { Sub, VerticalLabelAndValue } from '@nebula-js/ui';
import { fixHMR } from 'fix-hmr';
import React from 'react';
import styled from 'styled-components';

export interface NEBPriceProps {
  className?: string;
}

function NEBPriceBase({ className }: NEBPriceProps) {
  const { contractAddress } = useNebulaApp();

  const { data: { terraswapPoolInfo } = {} } = useTerraswapPoolQuery<NEB>(
    contractAddress.terraswap.nebUstPair,
  );

  return (
    <div className={className}>
      <p className="price">
        <AnimateNumber format={formatToken}>
          {terraswapPoolInfo
            ? terraswapPoolInfo.tokenPrice
            : (0 as NEB<number>)}
        </AnimateNumber>{' '}
        <Sub>UST</Sub>
      </p>

      <VerticalLabelAndValue
        className="circulating-supply"
        label="NEB CIRCULATING SUPPLY"
      >
        <s>100,000.123 NEB</s>
      </VerticalLabelAndValue>
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
      color: var(--color-white44);

      margin-bottom: 0.28571429em;
    }
  }
`;

export const NEBPrice = fixHMR(StyledNEBPrice);
