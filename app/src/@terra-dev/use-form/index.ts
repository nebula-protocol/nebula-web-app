import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

function shallowEqual(a: any, b: any): boolean {
  const aKeys = Object.keys(a);
  const bKeys = Object.keys(b);

  if (aKeys.length !== bKeys.length) {
    return false;
  }

  for (const key of aKeys) {
    if (!Object.is(a[key], b[key])) {
      return false;
    }
  }

  return true;
}

export function useForm<
  Input extends {},
  Dependency extends {},
  States extends {},
  AsyncStates extends {},
>(
  form: (
    input: Input,
    dependency: Dependency,
  ) => [States, Promise<AsyncStates> | undefined],
  dependency: Dependency,
  initialInput: () => Input,
): [(input: Partial<Input>) => void, States & (AsyncStates | {})] {
  const initialForm = useRef(form);

  const [initialInputValue] = useState(() => {
    return initialInput();
  });

  const lastInput = useRef(initialInputValue);
  const lastDependency = useRef<Dependency>(dependency);

  const resolver = useMemo<Resolver<AsyncStates>>(() => {
    return new Resolver<AsyncStates>();
  }, []);

  const [initialStates, initialAsyncStates] = useMemo<
    [States, Promise<AsyncStates> | undefined]
  >(() => {
    return initialForm.current(lastInput.current, lastDependency.current);
  }, []);

  const [states, setStates] = useState<States>(() => initialStates);

  const [asyncStates, setAsyncStates] = useState<AsyncStates | undefined>(
    undefined,
  );

  useEffect(() => {
    if (form !== initialForm.current) {
      console.warn(`Do not change form() reference!`);
    }
  }, [form]);

  useEffect(() => {
    if (initialAsyncStates) {
      resolver.next(initialAsyncStates);
    }
  }, [initialAsyncStates, resolver]);

  useEffect(() => {
    if (
      dependency === lastDependency.current ||
      shallowEqual(dependency, lastDependency.current)
    ) {
      return;
    } else {
      const [nextStates, nextAsyncStates] = initialForm.current(
        lastInput.current,
        dependency,
      );

      setStates(nextStates);

      if (nextAsyncStates) {
        resolver.next(nextAsyncStates);
      } else {
        resolver.clear();
        setAsyncStates(undefined);
      }

      lastDependency.current = dependency;
    }
  }, [dependency, resolver]);

  const updateInput = useCallback(
    (input: Partial<Input>) => {
      const nextInput = { ...lastInput.current, ...input };

      if (!shallowEqual(nextInput, lastInput.current)) {
        const [nextStates, nextAsyncStates] = initialForm.current(
          nextInput,
          lastDependency.current,
        );

        setStates(nextStates);

        if (nextAsyncStates) {
          resolver.next(nextAsyncStates);
        } else {
          resolver.clear();
          setAsyncStates(undefined);
        }

        lastInput.current = nextInput;
      }
    },
    [resolver],
  );

  useEffect(() => {
    resolver.subscribe(setAsyncStates);

    return () => {
      resolver.destroy();
    };
  }, [resolver]);

  return [updateInput, { ...states, ...asyncStates }];
}

export class Resolver<T> {
  latestId: number = -1;
  subscriptions: Set<(value: T) => void> = new Set();

  subscribe = (subscription: (value: T) => void): (() => void) => {
    this.subscriptions.add(subscription);

    return () => {
      this.subscriptions.delete(subscription);
    };
  };

  next = (value: Promise<T> | T) => {
    const id = Math.random() * 1000000;
    this.latestId = id;

    Promise.resolve(value).then((resolvedValue) => {
      if (this.latestId === id) {
        for (const subscription of this.subscriptions) {
          subscription(resolvedValue);
        }
      }
    });
  };

  clear = () => {
    this.latestId = -1;
  };

  destroy = () => {
    this.subscriptions.clear();
  };
}
