import { labelForValue, moveDown, moveUp, resolveRankedOrder } from './rankingHelpers';

import type { Option } from '../interfaces';

const OPTIONS: Option[] = [
  { label: 'Alpha', value: 'a' },
  { label: 'Beta', value: 'b' },
  { label: 'Gamma', value: 'c' },
];

describe('resolveRankedOrder', () => {
  it('returns the option order when there is no prior answer', () => {
    expect(resolveRankedOrder(OPTIONS, undefined)).toEqual(['a', 'b', 'c']);
  });

  it('honors a previously-stored order', () => {
    expect(resolveRankedOrder(OPTIONS, ['c', 'a', 'b'])).toEqual(['c', 'a', 'b']);
  });

  it('appends new options missing from the stored order', () => {
    expect(resolveRankedOrder(OPTIONS, ['b'])).toEqual(['b', 'a', 'c']);
  });

  it('drops stored values that are no longer options and de-dupes', () => {
    expect(resolveRankedOrder(OPTIONS, ['z', 'b', 'b', 'a'])).toEqual(['b', 'a', 'c']);
  });

  it('coerces numeric option values to strings', () => {
    const numericOptions: Option[] = [
      { label: 'One', value: 1 },
      { label: 'Two', value: 2 },
    ];
    expect(resolveRankedOrder(numericOptions, [2])).toEqual(['2', '1']);
  });
});

describe('moveUp / moveDown', () => {
  const order = ['a', 'b', 'c'];

  it('moves an item up', () => {
    expect(moveUp(order, 1)).toEqual(['b', 'a', 'c']);
  });

  it('is a no-op moving the top item up', () => {
    expect(moveUp(order, 0)).toBe(order);
  });

  it('moves an item down', () => {
    expect(moveDown(order, 0)).toEqual(['b', 'a', 'c']);
  });

  it('is a no-op moving the bottom item down', () => {
    expect(moveDown(order, 2)).toBe(order);
  });

  it('does not mutate the input array', () => {
    const input = ['a', 'b', 'c'];
    moveUp(input, 1);
    expect(input).toEqual(['a', 'b', 'c']);
  });
});

describe('labelForValue', () => {
  it('resolves an option label', () => {
    expect(labelForValue(OPTIONS, 'b')).toBe('Beta');
  });

  it('falls back to the value when no option matches', () => {
    expect(labelForValue(OPTIONS, 'x')).toBe('x');
  });
});
