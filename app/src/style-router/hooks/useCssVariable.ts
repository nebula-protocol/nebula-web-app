import { useEffect, useState } from 'react';
import { useStyle } from '../router/StyleRouter';

export function getCssVariable(
  variable: string,
  targetElement: HTMLElement = document.documentElement,
): string {
  const value = getComputedStyle(targetElement).getPropertyValue(variable);
  return value.replace(/\s+/g, '');
}

export function useCssVariable(
  variable: string,
  targetElement: HTMLElement = document.documentElement,
) {
  const { color } = useStyle();

  const [value, setValue] = useState<string>(() => {
    return getCssVariable(variable, targetElement);
  });

  useEffect(() => {
    setTimeout(() => {
      setValue(getCssVariable(variable, targetElement));
    }, 100);
  }, [color, targetElement, variable]);

  return value;
}
