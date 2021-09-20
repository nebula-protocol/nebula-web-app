import { useApp, useTerraswapPoolQuery } from '@libs/app-provider';
import { formatToken } from '@libs/formatter';
import { AnimateNumber } from '@libs/ui';
import { NebulaContants, NebulaContractAddress } from '@nebula-js/app-fns';
import { NEB } from '@nebula-js/types';
import { DiffSpan, Sub } from '@nebula-js/ui';
import React from 'react';
import styled from 'styled-components';

export interface NEBPriceProps {
  className?: string;
}

function NEBPriceBase({ className }: NEBPriceProps) {
  const { contractAddress } = useApp<NebulaContractAddress, NebulaContants>();

  const { data: { terraswapPoolInfo } = {} } = useTerraswapPoolQuery<NEB>(
    contractAddress.terraswap.nebUstPair,
  );

  return (
    <div className={className}>
      <p>
        <AnimateNumber format={formatToken}>
          {terraswapPoolInfo
            ? terraswapPoolInfo.tokenPrice
            : (0 as NEB<number>)}
        </AnimateNumber>
        <Sub>UST</Sub>
      </p>
      <p>
        <s>
          <DiffSpan diff={123.12} translateIconY="0.15em">
            123.12%
          </DiffSpan>
        </s>
      </p>

      <section>
        <h4>NEB CIRCULATING SUPPLY</h4>
        <p>
          <s>100,000.123 NEB</s>
        </p>
      </section>
    </div>
  );
}

export const NEBPrice = styled(NEBPriceBase)`
  > :nth-child(1) {
    font-size: var(--font-size32);
  }

  > :nth-child(2) {
    font-size: var(--font-size12);
  }

  > :nth-child(3) {
    margin-top: 3.3em;

    font-size: var(--font-size12);

    h4 {
      font-size: var(--font-size12);
      font-weight: 500;
      color: var(--color-white44);
    }
  }
`;
