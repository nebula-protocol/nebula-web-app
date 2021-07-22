import { DeleteOutline } from '@material-ui/icons';
import { EmptyButton } from '@nebula-js/ui';
import { fixHMR } from 'fix-hmr';
import React, { ReactNode } from 'react';
import styled from 'styled-components';

export interface TokenInputRemoveToolProps {
  className?: string;
  onDelete: () => void;
  children: ReactNode;
}

function TokenInputRemoveToolBase({
  className,
  onDelete,
  children,
}: TokenInputRemoveToolProps) {
  return (
    <div className={className}>
      <EmptyButton fontSize="1.21428571em" onClick={onDelete}>
        <DeleteOutline />
      </EmptyButton>
      <span>{children}</span>
    </div>
  );
}

export const StyledTokenInputRemoveTool = styled(TokenInputRemoveToolBase)`
  display: flex;
  justify-content: space-between;
  align-items: center;

  span {
    font-size: max(0.85714286em, 12px);
  }
`;

export const TokenInputRemoveTool = fixHMR(StyledTokenInputRemoveTool);
