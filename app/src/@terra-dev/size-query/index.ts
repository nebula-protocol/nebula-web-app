type Operator = '>' | '>=' | '=' | '<' | '<=';
type Comparator = [Operator, number];

export function parseSizeComparator(q: string): Comparator {
  const result = /(>|>=|=|<|<=)(\d+)/.exec(q);

  if (!result) {
    throw new Error(`Wrong size comparator string! "${q}"`);
  }

  return [result[1], +result[2]] as Comparator;
}

const memo = new Map<string, Comparator[]>();

export function parseSizeQuery(query: string): Comparator[] {
  if (memo.has(query)) {
    return memo.get(query)!;
  }

  const comparators = query
    .split(' and ')
    .map((str) => str.replace(/\s/g, ''))
    .map((str) => parseSizeComparator(str));

  memo.set(query, comparators);

  return comparators;
}

export function matchSizeQuery(size: number, query: string): boolean {
  return parseSizeQuery(query).every(([operator, value]) => {
    switch (operator) {
      case '>':
        return size > value;
      case '>=':
        return size >= value;
      case '<=':
        return size <= value;
      case '<':
        return size < value;
      case '=':
        return size === value;
      default:
        throw new Error(`Unknown operator "${operator}"`);
    }
  });
}
