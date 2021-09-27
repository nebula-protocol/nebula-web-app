import { App, useApp } from '@libs/app-provider';
import { NebulaContants, NebulaContractAddress } from '@nebula-js/app-fns';

export function useNebulaApp(): App<NebulaContractAddress, NebulaContants> {
  return useApp<NebulaContractAddress, NebulaContants>();
}
