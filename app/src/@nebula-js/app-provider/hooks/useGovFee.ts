import { useGasToUst } from '@libs/app-provider';
import { u, UST } from '@libs/types';
import { useNebulaApp } from '..';

export function useGovFee(): u<UST> {
  const { constants } = useNebulaApp();
  return useGasToUst(constants.govGas);
}
