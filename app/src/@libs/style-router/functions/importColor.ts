import { createLinkElement } from '@libs/style-router/components/ImportCss';
import { COLOR_KEY } from '@libs/style-router/env';

export function importColor(
  href: (color: string) => string,
  defaultColor: string,
  selector?: string,
) {
  const color = localStorage.getItem(COLOR_KEY) ?? defaultColor;

  if (color !== defaultColor) {
    localStorage.setItem(COLOR_KEY, color);
  }

  const link = createLinkElement(selector);

  link.setAttribute('href', href(color));
}
