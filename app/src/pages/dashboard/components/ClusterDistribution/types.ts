import { Rate, u, UST, HumanAddr } from '@nebula-js/types';

export interface Item {
  id: HumanAddr;
  name: string;
  symbol: string;
  provided: u<UST>;
  ratio: Rate;
  color: string;
}
