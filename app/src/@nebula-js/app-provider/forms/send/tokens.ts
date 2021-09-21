import {
  nativeTokenInfoQuery,
  SendTokenInfo,
  sendTokensForm,
  SendTokensFormInput,
} from '@libs/app-fns';
import { useApp } from '@libs/app-provider';
import { PersistCache } from '@libs/persist-cache';
import { CW20Addr, NativeDenom } from '@libs/types';
import { useForm } from '@libs/use-form';
import {
  clusterStateListQuery,
  NebulaContants,
  NebulaContractAddress,
} from '@nebula-js/app-fns';
import { useWallet } from '@terra-money/wallet-provider';
import { useCallback, useEffect } from 'react';

const NATIVE_DENOMS = ['uusd', 'uluna'] as NativeDenom[];
const FALLBACK = {
  assetInfo: {
    native_token: {
      denom: 'uusd',
    },
  },
  tokenInfo: nativeTokenInfoQuery('uusd')!,
} as SendTokenInfo;

const cw20AddrCache = new PersistCache<CW20Addr[]>(
  '__nebula_send_token_info__',
);

export function useSendTokensForm() {
  const { network } = useWallet();

  const { wasmClient, contractAddress } = useApp<
    NebulaContractAddress,
    NebulaContants
  >();

  const [_updateInput, states] = useForm(
    sendTokensForm,
    {
      wasmClient,
      fallbackTokenInfo: FALLBACK as any,
    },
    () =>
      ({
        nativeDenoms: NATIVE_DENOMS,
        cw20Addrs: cw20AddrCache.get(network.chainID) ?? [],
        selectedTokenInfo: undefined,
      } as SendTokensFormInput),
  );

  useEffect(() => {
    if (!cw20AddrCache.has(network.chainID)) {
      clusterStateListQuery(contractAddress.clusterFactory, wasmClient).then(
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
    wasmClient,
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
