import { useEffect, useState } from 'react';
import { useStyle } from '../router/StyleRouter';

export function useCssVariable(
  variable: string,
  targetElement: HTMLElement = document.documentElement,
) {
  const { color } = useStyle();

  const [value, setValue] = useState<string>(() => {
    return getComputedStyle(targetElement).getPropertyValue(variable);
  });

  useEffect(() => {
    setTimeout(() => {
      setValue(getComputedStyle(targetElement).getPropertyValue(variable));
    }, 100);
  }, [color, targetElement, variable]);

  return value;
}
