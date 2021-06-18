import { matchSizeQuery } from '../';

describe('size-query', () => {
  test('should match every queries', () => {
    expect(matchSizeQuery(100, '>90')).toBeTruthy();
    expect(matchSizeQuery(100, '>=90')).toBeTruthy();
    expect(matchSizeQuery(100, '>=100')).toBeTruthy();
    expect(matchSizeQuery(100, '=100')).toBeTruthy();
    expect(matchSizeQuery(100, '<110')).toBeTruthy();
    expect(matchSizeQuery(100, '<=110')).toBeTruthy();
    expect(matchSizeQuery(100, '<=100')).toBeTruthy();

    expect(matchSizeQuery(100, '>110')).toBeFalsy();
    expect(matchSizeQuery(100, '>=110')).toBeFalsy();
    expect(matchSizeQuery(100, '=90')).toBeFalsy();
    expect(matchSizeQuery(100, '<100')).toBeFalsy();
    expect(matchSizeQuery(100, '<=90')).toBeFalsy();

    expect(matchSizeQuery(100, '>10 and <200')).toBeTruthy();
    expect(matchSizeQuery(100, '<110 and >10')).toBeTruthy();

    expect(matchSizeQuery(100, '>100 and <200')).toBeFalsy();
  });
});
