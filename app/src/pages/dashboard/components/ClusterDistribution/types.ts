import { Rate, u, UST } from '@nebula-js/types';

export interface Item {
  label: string;
  labelShort: string;
  amount: u<UST>;
  ratio: Rate;
  color: string;
}
