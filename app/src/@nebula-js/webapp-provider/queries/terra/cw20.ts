import { CW20Addr } from '@nebula-js/types';
import {
  CW20TokenInfo,
  CW20Tokens,
  terraCW20TokensQuery,
} from '@nebula-js/webapp-fns';
import { useLocalStorageJson } from '@terra-dev/use-local-storage';
import { useWallet } from '@terra-money/wallet-provider';
import { useEffect, useMemo } from 'react';
import DEFAULT_VALUE from './cw20.json';

const STORAGE_KEY = '__terra_cw20_tokens__';

let fetched: boolean = false;

export function useTerraCW20TokensQuery(): Record<CW20Addr, CW20TokenInfo> {
  const { network } = useWallet();

  const [data, setData] = useLocalStorageJson<CW20Tokens>(
    STORAGE_KEY,
    () => DEFAULT_VALUE,
  );

  useEffect(() => {
    if (!fetched) {
      terraCW20TokensQuery().then(setData);
      fetched = true;
    }
  }, [setData]);

  return useMemo(() => {
    return network.name === 'testnet' ? data.testnet : data.mainnet;
  }, [data.mainnet, data.testnet, network.name]);
}
