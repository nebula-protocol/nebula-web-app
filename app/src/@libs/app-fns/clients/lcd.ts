type LCDResult<T> = { height: number; result: T };

export type LCDFetch = <T>(input: string, init?: RequestInit) => Promise<T>;

export function defaultLcdFetch<T>(
  input: string,
  init?: RequestInit,
): Promise<T> {
  return fetch(input, init)
    .then((res) => res.json())
    .then(({ result }: LCDResult<T>) => result);
}
