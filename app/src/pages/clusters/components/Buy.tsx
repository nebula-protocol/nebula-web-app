import { ArrowSouthIcon, WalletIcon } from '@nebula-js/icons';
import { NEB, UST } from '@nebula-js/types';
import {
  Button,
  EmptyButton,
  IconSeparator,
  TokenInput,
  TokenSpan,
  useScreenSizeValue,
} from '@nebula-js/ui';
import { FeeBox } from 'components/boxes/FeeBox';
import React, { useState } from 'react';
import styled from 'styled-components';

export interface ClusterBuyProps {
  className?: string;
}

function ClusterBuyBase({ className }: ClusterBuyProps) {
  const [fromAmount, setFromAmount] = useState<UST>('' as UST);
  const [toAmount, setToAmount] = useState<NEB>('' as NEB);

  const buttonSize = useScreenSizeValue<'normal' | 'medium'>({
    mobile: 'medium',
    tablet: 'normal',
    pc: 'normal',
    monitor: 'normal',
  });

  return (
    <div className={className}>
      <TokenInput
        value={fromAmount}
        onChange={setFromAmount}
        placeholder="0.00"
        label="FROM"
        suggest={
          <EmptyButton onClick={() => setFromAmount('1490' as UST)}>
            <WalletIcon
              style={{
                transform: 'translateX(-0.3em)',
              }}
            />{' '}
            1,490.000000
          </EmptyButton>
        }
        token={<TokenSpan>UST</TokenSpan>}
      />

      <IconSeparator style={{ height: 60, fontSize: 20 }}>
        <ArrowSouthIcon />
      </IconSeparator>

      <TokenInput
        value={toAmount}
        onChange={setToAmount}
        placeholder="0.00"
        label="TO"
        suggest={
          <EmptyButton onClick={() => setToAmount('1490' as NEB)}>
            <WalletIcon
              style={{
                transform: 'translateX(-0.3em)',
              }}
            />{' '}
            1,490.000000
          </EmptyButton>
        }
        token={<TokenSpan>NEB</TokenSpan>}
      />

      <FeeBox className="feebox">
        <li>
          <span>Tx Fee</span>
          <span>0.014072 UST</span>
        </li>
      </FeeBox>

      <Button className="submit" color="paleblue" size={buttonSize}>
        Buy
      </Button>
    </div>
  );
}

export const ClusterBuy = styled(ClusterBuyBase)`
  font-size: 1rem;

  .feebox {
    margin-top: 2.8em;
  }

  .submit {
    display: block;
    width: 100%;
    max-width: 360px;
    margin: 2.8em auto 0 auto;
  }
`;
