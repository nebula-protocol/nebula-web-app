import { createElement } from 'react';
import { StyleRouterState, useStyle } from '../router/StyleRouter';
import { ImportCss } from './ImportCss';

export interface CssRouteProps {
  href: (style: Pick<StyleRouterState, 'color' | 'breakpoint'>) => string;
  selector?: string;
}

export function CssRoute({ href, selector }: CssRouteProps) {
  const { color, breakpoint } = useStyle();

  return createElement(ImportCss, {
    href: href({ color, breakpoint }),
    selector,
  });
}
