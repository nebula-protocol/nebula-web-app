import styled from 'styled-components';
import React from 'react';

export interface HistoryProps {
  className?: string;
}

function HistoryBase({ className }: HistoryProps) {
  return <div className={className}>History</div>;
}

export const History = styled(HistoryBase)`
  // TODO
`;
