import React, { useMemo } from 'react';

import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { FM } from '@/localization/helpers';

import { TestIds } from '../../../../shared/testIds';
import { labelForValue, moveDown, moveUp, resolveRankedOrder } from '../../questionTypes/rankingHelpers';

import type { FormStyles } from '../../../../theme/utils/styles';
import type { Option } from '../../interfaces';

interface Props {
  value: Array<string | number>;
  errorMsg?: string;
  updateAnswer: (ordered: string[]) => void;
  styles: FormStyles;
  options: Option[];
}

const RANK_NUMBER_WIDTH = 28;
const CONTROL_GAP = 8;

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: CONTROL_GAP },
  rankNumber: { width: RANK_NUMBER_WIDTH, textAlign: 'center', fontWeight: '700' },
  itemLabel: { flex: 1 },
  controls: { flexDirection: 'row', gap: CONTROL_GAP },
});

export const RankingQuestion: React.FC<Props> = ({ value, errorMsg, updateAnswer, styles: formStyles, options }) => {
  const order = useMemo(() => resolveRankedOrder(options, value), [options, value]);
  const hasError = typeof errorMsg === 'string' && errorMsg !== '';

  if (options.length === 0) return null;

  return (
    <>
      <Text style={formStyles.helpText}>{FM('quizActive.rankingHelp')}</Text>
      {order.map((optionValue, index) => {
        const label = labelForValue(options, optionValue);
        const rankPosition = index + 1;
        const isFirst = index === 0;
        const isLast = index === order.length - 1;
        return (
          <View key={optionValue} style={[formStyles.optionRow, styles.row]}>
            <Text style={[formStyles.optionText, styles.rankNumber]}>{String(rankPosition)}</Text>
            <Text style={[formStyles.optionText, styles.itemLabel]}>{label}</Text>
            <View style={styles.controls}>
              <TouchableOpacity
                accessibilityHint={FM('quizActive.rankingMoveUpHint', label)}
                accessibilityLabel={FM('quizActive.rankingMoveUp', label)}
                accessibilityRole="button"
                accessibilityState={{ disabled: isFirst }}
                disabled={isFirst}
                testID={`${TestIds.RANKING_MOVE_UP}-${optionValue}`}
                onPress={() => updateAnswer(moveUp(order, index))}
              >
                <Text style={formStyles.optionText}>{FM('quizActive.rankingUpArrow')}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                accessibilityHint={FM('quizActive.rankingMoveDownHint', label)}
                accessibilityLabel={FM('quizActive.rankingMoveDown', label)}
                accessibilityRole="button"
                accessibilityState={{ disabled: isLast }}
                disabled={isLast}
                testID={`${TestIds.RANKING_MOVE_DOWN}-${optionValue}`}
                onPress={() => updateAnswer(moveDown(order, index))}
              >
                <Text style={formStyles.optionText}>{FM('quizActive.rankingDownArrow')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      })}
      {hasError ? <Text style={formStyles.errorText}>{errorMsg}</Text> : null}
    </>
  );
};
