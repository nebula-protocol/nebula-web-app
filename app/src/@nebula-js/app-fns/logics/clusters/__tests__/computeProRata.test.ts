import { Token, u } from '@nebula-js/types';
import { computeProRata } from '../computeProRata';

const inventories = ['1000', '2000', '3000', '4000'];

describe('computeProRata()', () => {
  test('When input amount on index 3', () => {
    expect(
      computeProRata(inventories as u<Token>[], '100' as Token, 3),
    ).toEqual(['25', '50', '75', '100']);
  });

  test('When input amount on index 1', () => {
    expect(computeProRata(inventories as u<Token>[], '20' as Token, 1)).toEqual(
      ['10', '20', '30', '40'],
    );
  });

  test('When input nothing', () => {
    expect(computeProRata(inventories as u<Token>[], '' as Token, 0)).toEqual([
      '',
      '',
      '',
      '',
    ]);
  });

  test('When input 0', () => {
    expect(computeProRata(inventories as u<Token>[], '0' as Token, 3)).toEqual([
      '0',
      '0',
      '0',
      '0',
    ]);
  });

  test('When input amount on unexisting index', () => {
    expect(
      computeProRata(inventories as u<Token>[], '100' as Token, 1000),
    ).toEqual(['0', '0', '0', '0']);
  });
});
