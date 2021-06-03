import React, {
  createContext,
  useContext,
  Context,
  Consumer,
  ReactNode,
} from 'react';

export interface NebulaWebappProviderProps {
  children: ReactNode;
}

export interface NebulaWebapp {}

// @ts-ignore
const NebulaWebappContext: Context<NebulaWebapp> = createContext<NebulaWebapp>();

export function NebulaWebappProvider({ children }: NebulaWebappProviderProps) {
  return (
    <NebulaWebappContext.Provider value={{}}>
      {children}
    </NebulaWebappContext.Provider>
  );
}

export function useNebulaWebapp(): NebulaWebapp {
  return useContext(NebulaWebappContext);
}

export const NebulaWebappConsumer: Consumer<NebulaWebapp> =
  NebulaWebappContext.Consumer;
