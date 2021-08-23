import React, { ReactNode, useMemo } from 'react';
import { StyleRouterContext, StyleRouterState } from './StyleRouter';

export interface StaticStyleRouterProps {
  children: ReactNode;
  color: string;
  breakpoint: string;
}

export function StaticStyleRouter({
  children,
  color,
  breakpoint,
}: StaticStyleRouterProps) {
  const state = useMemo<StyleRouterState>(
    () => ({
      color,
      breakpoint,
      updateColor: () => {},
    }),
    [breakpoint, color],
  );

  return (
    <StyleRouterContext.Provider value={state}>
      {children}
    </StyleRouterContext.Provider>
  );
}
