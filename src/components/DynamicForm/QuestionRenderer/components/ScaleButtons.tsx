import React from 'react';

import { View, TouchableOpacity, Text } from 'react-native';

import { FM } from '@/localization/helpers';

import type { FormStyles } from '../../../../theme/utils/styles';

interface Props {
  ticks: number[];
  value: number | null;
  minLabel?: string;
  maxLabel?: string;
  errorMsg?: string;
  updateAnswer: (v: number) => void;
  styles: FormStyles;
}

/** Reusable discrete-scale selector (used by Rating, Nps and stepped LinearScale). */
export const ScaleButtons: React.FC<Props> = ({ ticks, value, minLabel, maxLabel, errorMsg, updateAnswer, styles }) => {
  const hasError = typeof errorMsg === 'string' && errorMsg !== '';
  const showLabels = (minLabel ?? '') !== '' || (maxLabel ?? '') !== '';
  return (
    <>
      <View style={styles.scaleRow}>
        {ticks.map((tick) => {
          const selected = value === tick;
          return (
            <TouchableOpacity
              key={String(tick)}
              accessibilityHint={FM('quizActive.scaleOptionHint')}
              accessibilityLabel={FM('quizActive.scaleOptionLabel', String(tick))}
              accessibilityRole="button"
              style={[styles.scaleButton, selected ? styles.scaleButtonSelected : null]}
              testID={`scale-option-${String(tick)}`}
              onPress={() => updateAnswer(tick)}
            >
              <Text style={selected ? styles.scaleButtonTextSelected : styles.scaleButtonText}>{String(tick)}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      {showLabels ? (
        <View style={styles.scaleLabelsRow}>
          <Text style={styles.scaleLabelText}>{minLabel ?? ''}</Text>
          <Text style={styles.scaleLabelText}>{maxLabel ?? ''}</Text>
        </View>
      ) : null}
      {hasError ? <Text style={styles.errorText}>{errorMsg}</Text> : null}
    </>
  );
};
