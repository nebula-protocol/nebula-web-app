import { useGasToLuna } from '@libs/app-provider';
import { u, Luna } from '@libs/types';
import { useNebulaApp } from '..';

export function useGovFee(): u<Luna> {
  const { constants } = useNebulaApp();
  return useGasToLuna(constants.govGas);
}
