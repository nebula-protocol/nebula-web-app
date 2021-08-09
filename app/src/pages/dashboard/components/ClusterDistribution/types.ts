import { Rate, u, UST } from '@nebula-js/types';

export interface Item {
  name: string;
  symbol: string;
  marketCap: u<UST>;
  ratio: Rate;
  color: string;
}
