import {
  EMPTY_NATIVE_BALANCES,
  pickNativeBalance,
} from '@libs/app-fns/queries/terra/nativeBalances';
import { useTerraNativeBalancesQuery } from '@libs/app-provider/queries/terra/nativeBalances';
import { CW20Addr, HumanAddr, NativeDenom, Token, u } from '@libs/types';
import { useConnectedWallet } from '@terra-dev/use-wallet';
import { useMemo } from 'react';
import { useCW20BalanceQuery } from '../cw20/balance';

export function useSendBalanceQuery<T extends Token>(
  token: NativeDenom | CW20Addr,
  walletAddr?: HumanAddr | undefined,
): u<T> {
  const connectedWallet = useConnectedWallet();

  const { data: nativeBalances = EMPTY_NATIVE_BALANCES } =
    useTerraNativeBalancesQuery(walletAddr ?? connectedWallet?.walletAddress);

  const { data: { tokenBalance } = {} } = useCW20BalanceQuery<Token>(
    token.length > 10 ? (token as CW20Addr) : undefined,
    connectedWallet?.walletAddress,
  );

  return useMemo<u<T>>(() => {
    if (!connectedWallet) {
      return '0' as u<T>;
    } else if (token.length > 10) {
      return (tokenBalance?.balance ?? '0') as u<T>;
    }

    return pickNativeBalance<T>(token as NativeDenom, nativeBalances);
  }, [connectedWallet, nativeBalances, token, tokenBalance?.balance]);
}
