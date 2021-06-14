import { Rate, uUST } from '@nebula-js/types';

export interface Item {
  label: string;
  labelShort: string;
  amount: uUST;
  ratio: Rate;
  color: string;
}
