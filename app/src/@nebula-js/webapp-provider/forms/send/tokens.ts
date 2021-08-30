import { PersistCache } from '@libs/persist-cache';
import { CW20Addr, NativeDenom } from '@libs/types';
import { useForm } from '@libs/use-form';
import {
  nativeTokenInfoQuery,
  SendTokenInfo,
  sendTokensForm,
  SendTokensFormInput,
} from '@libs/webapp-fns';
import { useTerraWebapp } from '@libs/webapp-provider';
import { clusterStateListQuery } from '@nebula-js/webapp-fns';
import { useNebulaWebapp } from '@nebula-js/webapp-provider';
import { useCallback, useEffect } from 'react';

const NATIVE_DENOMS = ['uusd', 'uluna'] as NativeDenom[];
const FALLBACK = {
  assetInfo: {
    native_token: {
      denom: 'uusd' as NativeDenom,
    },
  },
  tokenInfo: nativeTokenInfoQuery('uusd' as NativeDenom)!,
} as SendTokenInfo;

const cw20AddrCache = new PersistCache<CW20Addr[]>(
  '__nebula_send_token_info__',
);

export function useSendTokensForm() {
  const { mantleFetch, mantleEndpoint } = useTerraWebapp();

  const { contractAddress } = useNebulaWebapp();

  const [_updateInput, states] = useForm(
    sendTokensForm,
    {
      mantleEndpoint,
      mantleFetch,
      fallbackTokenInfo: FALLBACK as any,
    },
    () =>
      ({
        nativeDenoms: NATIVE_DENOMS,
        cw20Addrs: cw20AddrCache.get(mantleEndpoint) ?? [],
        selectedTokenInfo: undefined,
      } as SendTokensFormInput),
  );

  useEffect(() => {
    if (!cw20AddrCache.has(mantleEndpoint)) {
      clusterStateListQuery(
        contractAddress.clusterFactory,
        mantleEndpoint,
        mantleFetch,
      ).then((clusterStates) => {
        const cw20Addrs = clusterStates.map(
          ({ cluster_token }) => cluster_token,
        );
        cw20AddrCache.set(mantleEndpoint, cw20Addrs);
        _updateInput({ cw20Addrs });
      });
    }
  }, [
    contractAddress.clusterFactory,
    mantleEndpoint,
    mantleFetch,
    _updateInput,
  ]);

  const updateInput = useCallback(
    (input: Partial<SendTokensFormInput>) => {
      if (input.cw20Addrs) {
        cw20AddrCache.set(mantleEndpoint, input.cw20Addrs);
      }
      _updateInput(input);
    },
    [_updateInput, mantleEndpoint],
  );

  return [updateInput, states] as const;
}
