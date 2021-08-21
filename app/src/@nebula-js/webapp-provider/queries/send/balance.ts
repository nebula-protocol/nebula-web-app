import { CW20Addr, NativeDenom, Token, u } from '@nebula-js/types';
import { NebulaTokenBalances } from '@nebula-js/webapp-fns';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useBank } from '@packages/webapp-provider';
import { useMemo } from 'react';
import { useCW20BalanceQuery } from '../cw20/balance';

export function useSendBalanceQuery<T extends Token>(
  token: NativeDenom | CW20Addr,
): u<T> {
  const connectedWallet = useConnectedWallet();

  const { tokenBalances } = useBank<NebulaTokenBalances>();

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

    switch (token) {
      case 'uusd':
        return tokenBalances.uUST as u<T>;
      case 'uluna':
        return tokenBalances.uLuna as u<T>;
      default:
        return '0' as u<T>;
    }
  }, [
    connectedWallet,
    token,
    tokenBalance?.balance,
    tokenBalances.uLuna,
    tokenBalances.uUST,
  ]);
}
