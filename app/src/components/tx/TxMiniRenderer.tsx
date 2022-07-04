import { DoneAllRounded, ErrorOutlineRounded } from '@material-ui/icons';
import { TxResultRendering, TxStreamPhase } from '@libs/app-fns';
import { fixHMR } from 'fix-hmr';
import React from 'react';
import { GuardSpinner, RotateSpinner } from 'react-spinners-kit';
import styled from 'styled-components';

export interface TxMiniRendererProps {
  className?: string;
  result: TxResultRendering;
  onExpand: () => void;
}

function TxMiniRendererBase({
  className,
  result,
  onExpand,
}: TxMiniRendererProps) {
  return (
    <div className={className} onClick={onExpand}>
      {result.phase === TxStreamPhase.POST ? (
        <RotateSpinner color="var(--color-paleblue)" size={30} />
      ) : result.phase === TxStreamPhase.BROADCAST ? (
        <GuardSpinner frontColor="var(--color-paleblue)" size={25} />
      ) : result.phase === TxStreamPhase.SUCCEED ? (
        <DoneAllRounded style={{ color: 'var(--color-paleblue)' }} />
      ) : result.phase === TxStreamPhase.FAILED ? (
        <ErrorOutlineRounded style={{ color: 'var(--color-red)' }} />
      ) : null}
    </div>
  );
}

export const StyledTxMiniRenderer = styled(TxMiniRendererBase)`
  position: fixed;
  right: 10px;
  bottom: 10px;

  user-select: none;
  cursor: pointer;

  background-color: var(--color-gray4);

  display: grid;
  place-content: center;

  width: 50px;
  height: 50px;
  border-radius: 50%;

  svg {
    font-size: 30px;
  }
`;

export const TxMiniRenderer = fixHMR(StyledTxMiniRenderer);
