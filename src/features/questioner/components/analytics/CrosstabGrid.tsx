import React from 'react';

import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { FM } from '@/localization/helpers';
import { useTheme } from '@/theme/hooks/useTheme';

import type { CrosstabStats } from '../../utils/analyticsTypes';

const CELL_MIN_WIDTH = 72;
const CELL_PADDING_V = 6;
const CELL_PADDING_H = 8;
const CELL_FONT_SIZE = 13;
const BORDER_WIDTH = 1;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  cell: {
    minWidth: CELL_MIN_WIDTH,
    paddingVertical: CELL_PADDING_V,
    paddingHorizontal: CELL_PADDING_H,
    borderWidth: BORDER_WIDTH,
  },
  cellText: {
    fontSize: CELL_FONT_SIZE,
  },
  headerText: {
    fontSize: CELL_FONT_SIZE,
    fontWeight: '600',
  },
});

interface CrosstabGridProps {
  crosstab: CrosstabStats;
}

/** Renders the crosstab count matrix with a header row, per-row totals and a totals row. */
const CrosstabGrid = ({ crosstab }: CrosstabGridProps): React.ReactElement => {
  const { theme } = useTheme();
  const { colors } = theme;
  const borderColor = colors.border;
  const grandTotal = crosstab.colTotals.reduce((acc, value) => acc + value, 0);

  const totalHeader = FM('quizAnalytics.crosstab.totalHeader');
  const headerKeys = [`corner-${crosstab.rowQuestionName}`, ...crosstab.colBuckets, `header-${totalHeader}`];
  const headerCells = [crosstab.rowQuestionName, ...crosstab.colBuckets, totalHeader];

  return (
    <ScrollView horizontal>
      <View>
        <View style={styles.row}>
          {headerCells.map((text, index) => (
            <View key={headerKeys[index]} style={[styles.cell, { borderColor }]}>
              <Text style={[styles.headerText, { color: colors.text }]}>{text}</Text>
            </View>
          ))}
        </View>
        {crosstab.rows.map((row) => (
          <View key={row.bucket} style={styles.row}>
            <View style={[styles.cell, { borderColor }]}>
              <Text style={[styles.headerText, { color: colors.text }]}>{row.bucket}</Text>
            </View>
            {row.cells.map((cell, index) => (
              <View key={`${row.bucket}-${crosstab.colBuckets[index]}`} style={[styles.cell, { borderColor }]}>
                <Text style={[styles.cellText, { color: colors.text }]}>{String(cell.count)}</Text>
              </View>
            ))}
            <View style={[styles.cell, { borderColor }]}>
              <Text style={[styles.headerText, { color: colors.text }]}>{String(row.total)}</Text>
            </View>
          </View>
        ))}
        <View style={styles.row}>
          <View style={[styles.cell, { borderColor }]}>
            <Text style={[styles.headerText, { color: colors.text }]}>{totalHeader}</Text>
          </View>
          {crosstab.colTotals.map((total, index) => (
            <View key={`total-${crosstab.colBuckets[index]}`} style={[styles.cell, { borderColor }]}>
              <Text style={[styles.headerText, { color: colors.text }]}>{String(total)}</Text>
            </View>
          ))}
          <View style={[styles.cell, { borderColor }]}>
            <Text style={[styles.headerText, { color: colors.text }]}>{String(grandTotal)}</Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default CrosstabGrid;
