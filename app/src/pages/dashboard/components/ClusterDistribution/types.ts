import { Rate, u, Luna, HumanAddr } from '@nebula-js/types';

export interface Item {
  id: HumanAddr;
  name: string;
  symbol: string;
  provided: u<Luna>;
  ratio: Rate;
  color: string;
}
