import { TxReceipt } from '@libs/app-fns';
import { FeeBox } from 'components/boxes/FeeBox';
import { fixHMR } from 'fix-hmr';
import React from 'react';
import styled from 'styled-components';

export interface TxReceiptsProps {
  className?: string;
  receipts: (TxReceipt | undefined | null | false)[];
}

function TxReceiptsBase({ className, receipts }: TxReceiptsProps) {
  const filteredReceipts = receipts.filter(
    (receipt): receipt is TxReceipt => !!receipt,
  );

  return filteredReceipts.length > 0 ? (
    <FeeBox className={className}>
      {filteredReceipts.map(({ name, value }, i) => (
        <li key={'receipt-' + i}>
          {typeof name === 'string' ? (
            <span>{name}</span>
          ) : (
            <span dangerouslySetInnerHTML={{ __html: name.html }} />
          )}
          {typeof value === 'string' ? (
            <span>{value}</span>
          ) : (
            <span dangerouslySetInnerHTML={{ __html: value.html }} />
          )}
        </li>
      ))}
    </FeeBox>
  ) : null;
}

export const StyledTxReceipts = styled(TxReceiptsBase)`
  // TODO
`;

export const TxReceipts = fixHMR(StyledTxReceipts);
