import { matchSizeQuery } from '@libs/size-query';
import { useCallback, useEffect, useRef, useState } from 'react';
import ResizeObserver from 'resize-observer-polyfill';

export function useContainerBreakpoints<
  E extends HTMLElement,
  T extends string,
>(breakpoints: [T, string][]): [T | null, (element: E) => void] {
  const [containerSize, setContainerSize] = useState<T | null>(null);

  const observer = useRef<ResizeObserver | null>();

  const ref = useCallback(
    (element: E) => {
      if (observer.current) {
        observer.current.disconnect();
      }

      if (!element) {
        return null;
      }

      observer.current = new ResizeObserver((entry: ResizeObserverEntry[]) => {
        const matched = entry.find(({ target }) => element === target);

        if (!matched) {
          return;
        }

        const width = matched.contentRect.width;

        const matchedSize = breakpoints.find(([, query]) => {
          return matchSizeQuery(width, query);
        });

        setContainerSize(matchedSize ? matchedSize[0] : null);
      });

      observer.current.observe(element);
    },
    [breakpoints],
  );

  useEffect(() => {
    return () => {
      observer.current?.disconnect();
    };
  }, []);

  return [containerSize, ref];
}
