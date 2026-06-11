import React from 'react';

import { ScaleButtons } from './ScaleButtons';
import { RATING_MAX, RATING_MIN, SCALE_STEP_DEFAULT } from '../../questionTypes/constants';
import { buildScaleTicks, resolveScaleBounds } from '../../questionTypes/scaleHelpers';

import type { FormStyles } from '../../../../theme/utils/styles';
import type { QuestionConfig } from '../../interfaces';

interface Props {
  value: number | null;
  config?: QuestionConfig;
  errorMsg?: string;
  updateAnswer: (v: number) => void;
  styles: FormStyles;
}

const RATING_FALLBACK = { min: RATING_MIN, max: RATING_MAX, step: SCALE_STEP_DEFAULT };

export const RatingQuestion: React.FC<Props> = ({ value, config, errorMsg, updateAnswer, styles }) => {
  const bounds = resolveScaleBounds(config, RATING_FALLBACK);
  const ticks = buildScaleTicks(bounds);
  return (
    <ScaleButtons
      errorMsg={errorMsg}
      maxLabel={config?.maxLabel ?? undefined}
      minLabel={config?.minLabel ?? undefined}
      styles={styles}
      ticks={ticks}
      updateAnswer={updateAnswer}
      value={value}
    />
  );
};
