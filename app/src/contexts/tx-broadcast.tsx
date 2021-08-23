import { TxResultRendering } from '@libs/webapp-fns';
import { TxMiniRenderer } from 'components/tx/TxMiniRenderer';
import { TxRenderer } from 'components/tx/TxRenderer';
import React, {
  Consumer,
  Context,
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Observable } from 'rxjs';

export interface TxBroadcastProviderProps {
  children: ReactNode;
}

export interface TxBroadcast {
  broadcast: (stream: Observable<TxResultRendering>) => void;
}

// @ts-ignore
const TxBroadcastContext: Context<TxBroadcast> = createContext<TxBroadcast>();

type View = 'dialog' | 'mini';

export function TxBroadcastProvider({ children }: TxBroadcastProviderProps) {
  const [view, setView] = useState<View>('dialog');

  const [stream, setStream] = useState<Observable<TxResultRendering> | null>(
    null,
  );

  const [result, setResult] = useState<TxResultRendering | null>(null);

  const broadcast = useCallback((nextStream: Observable<TxResultRendering>) => {
    setView('dialog');
    setStream(nextStream);
  }, []);

  useEffect(() => {
    if (stream) {
      let timeoutId: any = null;

      const subscription = stream.subscribe({
        next: setResult,
        error: (error) => {
          console.error(error);
          setStream(null);
          setResult(null);
        },
        complete: () => {
          timeoutId = setTimeout(() => {
            setStream(null);
            setResult(null);
          }, 1000 * 30);
        },
      });

      return () => {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        subscription.unsubscribe();
      };
    }
  }, [stream]);

  return (
    <TxBroadcastContext.Provider value={{ broadcast }}>
      {children}
      {result &&
        (view === 'mini' ? (
          <TxMiniRenderer result={result} onExpand={() => setView('dialog')} />
        ) : (
          <TxRenderer
            result={result}
            onMinify={() => setView('mini')}
            onClose={() => {
              setStream(null);
              setResult(null);
            }}
          />
        ))}
    </TxBroadcastContext.Provider>
  );
}

export function useTxBroadcast(): TxBroadcast {
  return useContext(TxBroadcastContext);
}

export const TxBroadcastConsumer: Consumer<TxBroadcast> =
  TxBroadcastContext.Consumer;
