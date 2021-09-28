import { App, useApp } from '@libs/app-provider';
import { NebulaContants, NebulaContractAddress } from '../types';

export function useNebulaApp(): App<NebulaContractAddress, NebulaContants> {
  return useApp<NebulaContractAddress, NebulaContants>();
}
