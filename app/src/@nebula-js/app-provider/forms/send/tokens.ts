import {
  nativeTokenInfoQuery,
  SendTokenInfo,
  sendTokensForm,
  SendTokensFormInput,
} from '@libs/app-fns';
import { PersistCache } from '@libs/persist-cache';
import { CW20Addr, NativeDenom } from '@libs/types';
import { useForm } from '@libs/use-form';
import { clusterStateListQuery } from '@nebula-js/app-fns';
import { useWallet } from '@terra-money/wallet-provider';
import { useCallback, useEffect } from 'react';
import { useNebulaApp } from '../../hooks/useNebulaApp';

const NATIVE_DENOMS = ['uluna'] as NativeDenom[];
const FALLBACK = {
  assetInfo: {
    native_token: {
      denom: 'uluna',
    },
  },
  tokenInfo: nativeTokenInfoQuery('uluna')!,
} as SendTokenInfo;

const cw20AddrCache = new PersistCache<CW20Addr[]>(
  '__nebula_send_token_info__',
);

export function useSendTokensForm() {
  const { network } = useWallet();

  const { queryClient, contractAddress } = useNebulaApp();

  const [_updateInput, states] = useForm(
    sendTokensForm,
    {
      queryClient,
      fallbackTokenInfo: FALLBACK as any,
    },
    () =>
      ({
        nativeDenoms: NATIVE_DENOMS,
        cw20Addrs: [contractAddress.cw20.NEB].concat(
          cw20AddrCache.get(network.chainID) ?? [],
        ),
        selectedTokenInfo: undefined,
      } as SendTokensFormInput),
  );

  useEffect(() => {
    if (!cw20AddrCache.has(network.chainID)) {
      clusterStateListQuery(contractAddress.clusterFactory, queryClient).then(
        (clusterStates) => {
          const cw20Addrs = clusterStates.map(
            ({ cluster_token }) => cluster_token,
          );
          cw20AddrCache.set(network.chainID, cw20Addrs);
          _updateInput({ cw20Addrs });
        },
      );
    }
  }, [
    contractAddress.clusterFactory,
    _updateInput,
    network.chainID,
    queryClient,
  ]);

  const updateInput = useCallback(
    (input: Partial<SendTokensFormInput>) => {
      if (input.cw20Addrs) {
        cw20AddrCache.set(network.chainID, input.cw20Addrs);
      }
      _updateInput(input);
    },
    [_updateInput, network.chainID],
  );

  return [updateInput, states] as const;
}
