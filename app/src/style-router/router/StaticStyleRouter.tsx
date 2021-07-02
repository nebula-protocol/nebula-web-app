import React, { ReactNode, useMemo, useState } from 'react';
import { StyleRouterContext, StyleRouterState } from './StyleRouter';

export interface StaticStyleRouterProps {
  children: ReactNode;
  defaultColor: string;
  breakpoint: string;
}

export function StaticStyleRouter({
  children,
  defaultColor,
  breakpoint,
}: StaticStyleRouterProps) {
  const [color, setColor] = useState<string>(defaultColor);

  const state = useMemo<StyleRouterState>(
    () => ({ color, breakpoint, updateColor: setColor }),
    [breakpoint, color],
  );

  return (
    <StyleRouterContext.Provider value={state}>
      {children}
    </StyleRouterContext.Provider>
  );
}
