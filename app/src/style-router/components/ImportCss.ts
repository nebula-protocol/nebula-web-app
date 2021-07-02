import { useStateRef } from '@terra-dev/use-state-ref';
import { useEffect, useMemo, useRef } from 'react';

export interface ImportCssProps {
  href: string;
  selector?: string;
}

function createLinkElement(selector?: string): HTMLLinkElement {
  if (selector) {
    const element = document.querySelector<HTMLLinkElement>(selector);
    if (element) {
      element.setAttribute('data-import-css', '');
      return element;
    }
  }

  const element = document.createElement('link');
  element.setAttribute('data-import-css', '');
  element.setAttribute('rel', 'stylesheet');

  const head = document.querySelector('head');

  if (!head) {
    throw new Error(`Can't find <head> tag!`);
  }

  head.insertBefore(element, head.children[0]);

  return element;
}

export function ImportCss({ href, selector }: ImportCssProps) {
  const initialSelector = useRef(selector);
  const hrefRef = useStateRef(href);

  const element = useMemo(() => {
    return createLinkElement(initialSelector.current);
  }, []);

  useEffect(() => {
    element.setAttribute('href', href);
  }, [element, href]);

  useEffect(() => {
    const _selector = initialSelector.current;
    const _href = hrefRef.current;

    return () => {
      if (_selector) {
        if (element.href === _href) {
          element.removeAttribute('href');
        }
      } else {
        element.parentElement?.removeChild(element);
      }
    };
  }, [element, hrefRef]);

  return null;
}
