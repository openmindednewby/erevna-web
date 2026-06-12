import {
  applySelection,
  decodeSelections,
  encodeSelection,
  getMatrixColumns,
  getMatrixRows,
  selectedColumnForRow,
  toColValue,
  toRowValue,
} from './matrixEncoding';

import type { Option } from '../interfaces';

const OPTIONS: Option[] = [
  { label: 'Speed', value: 'row:r1' },
  { label: 'Price', value: 'row:r2' },
  { label: 'Low', value: 'col:c1' },
  { label: 'High', value: 'col:c2' },
];

describe('axis prefixing', () => {
  it('builds prefixed row/column option values', () => {
    expect(toRowValue('r1')).toBe('row:r1');
    expect(toColValue('c2')).toBe('col:c2');
  });

  it('extracts rows from options', () => {
    expect(getMatrixRows(OPTIONS)).toEqual([
      { id: 'r1', label: 'Speed' },
      { id: 'r2', label: 'Price' },
    ]);
  });

  it('extracts columns from options', () => {
    expect(getMatrixColumns(OPTIONS)).toEqual([
      { id: 'c1', label: 'Low' },
      { id: 'c2', label: 'High' },
    ]);
  });

  it('returns empty axes for undefined options', () => {
    expect(getMatrixRows(undefined)).toEqual([]);
    expect(getMatrixColumns(undefined)).toEqual([]);
  });
});

describe('selection encoding', () => {
  it('encodes a row/col pair', () => {
    expect(encodeSelection('r1', 'c2')).toBe('r1:c2');
  });

  it('decodes selections, keeping the last write per row', () => {
    expect(decodeSelections(['r1:c1', 'r2:c2', 'r1:c2'])).toEqual([
      { rowId: 'r1', colId: 'c2' },
      { rowId: 'r2', colId: 'c2' },
    ]);
  });

  it('ignores malformed entries', () => {
    expect(decodeSelections(['r1', ':c1', 'r2:', 'r3:c3'])).toEqual([{ rowId: 'r3', colId: 'c3' }]);
  });

  it('reports the selected column for a row', () => {
    expect(selectedColumnForRow(['r1:c1'], 'r1')).toBe('c1');
    expect(selectedColumnForRow(['r1:c1'], 'r2')).toBeNull();
  });

  it('applies a selection, replacing any prior pick for that row', () => {
    expect(applySelection(['r1:c1', 'r2:c2'], 'r1', 'c2')).toEqual(['r2:c2', 'r1:c2']);
  });

  it('adds a selection for a new row', () => {
    expect(applySelection(['r1:c1'], 'r2', 'c1')).toEqual(['r1:c1', 'r2:c1']);
  });
});
