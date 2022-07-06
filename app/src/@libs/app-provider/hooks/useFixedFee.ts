import { useApp, useGasToLuna } from '@libs/app-provider';
import { u, Luna } from '@libs/types';

export function useFixedFee(): u<Luna> {
  const { constants } = useApp();
  return useGasToLuna(constants.fixedGas);
}
