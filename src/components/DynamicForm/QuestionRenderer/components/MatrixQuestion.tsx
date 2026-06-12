import React from 'react';

import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { FM } from '@/localization/helpers';

import { TestIds } from '../../../../shared/testIds';
import {
  applySelection,
  getMatrixColumns,
  getMatrixRows,
  selectedColumnForRow,
} from '../../questionTypes/matrixEncoding';

import type { FormStyles } from '../../../../theme/utils/styles';
import type { Option } from '../../interfaces';

interface Props {
  value: Array<string | number>;
  errorMsg?: string;
  updateAnswer: (encoded: string[]) => void;
  styles: FormStyles;
  options: Option[];
}

const CELL_GAP = 8;
const ROW_LABEL_FLEX = 2;
const CELL_FLEX = 1;

const styles = StyleSheet.create({
  rowBlock: { marginBottom: 12 },
  rowLabel: { flex: ROW_LABEL_FLEX, fontWeight: '600' },
  cellsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: CELL_GAP, marginTop: 6 },
  cell: { flex: CELL_FLEX, minWidth: 80, alignItems: 'center' },
});

export const MatrixQuestion: React.FC<Props> = ({ value, errorMsg, updateAnswer, styles: formStyles, options }) => {
  const rows = getMatrixRows(options);
  const columns = getMatrixColumns(options);
  const hasError = typeof errorMsg === 'string' && errorMsg !== '';

  if (rows.length === 0 || columns.length === 0) return null;

  return (
    <>
      <Text style={formStyles.helpText}>{FM('quizActive.matrixHelp')}</Text>
      {rows.map((row) => {
        const selectedColId = selectedColumnForRow(value, row.id);
        return (
          <View key={row.id} style={styles.rowBlock}>
            <Text style={[formStyles.optionText, styles.rowLabel]}>{row.label}</Text>
            <View style={styles.cellsRow}>
              {columns.map((column) => {
                const isSelected = selectedColId === column.id;
                return (
                  <TouchableOpacity
                    key={column.id}
                    accessibilityHint={FM('quizActive.matrixCellHint', row.label, column.label)}
                    accessibilityLabel={FM('quizActive.matrixCell', row.label, column.label)}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: isSelected }}
                    style={[formStyles.optionRow, styles.cell, isSelected ? formStyles.optionRowSelected : null]}
                    testID={`${TestIds.MATRIX_CELL}-${row.id}-${column.id}`}
                    onPress={() => updateAnswer(applySelection(value, row.id, column.id))}
                  >
                    <Text style={formStyles.optionText}>{column.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        );
      })}
      {hasError ? <Text style={formStyles.errorText}>{errorMsg}</Text> : null}
    </>
  );
};
