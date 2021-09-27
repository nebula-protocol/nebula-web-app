import { useCW20Balance } from '@libs/app-provider';
import { HumanAddr, NEB, u } from '@nebula-js/types';
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { useNebulaApp } from './useNebulaApp';

export function useNebBalance(walletAddr?: HumanAddr | undefined): u<NEB> {
  const { contractAddress } = useNebulaApp();
  const connectedWallet = useConnectedWallet();

  return useCW20Balance<NEB>(
    contractAddress.cw20.NEB,
    walletAddr ?? connectedWallet?.walletAddress,
  );
}
