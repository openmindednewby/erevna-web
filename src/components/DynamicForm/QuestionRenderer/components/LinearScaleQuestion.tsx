import React from 'react';

import { ScaleButtons } from './ScaleButtons';
import { LINEAR_SCALE_MAX, LINEAR_SCALE_MIN, SCALE_STEP_DEFAULT } from '../../questionTypes/constants';
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

const LINEAR_FALLBACK = { min: LINEAR_SCALE_MIN, max: LINEAR_SCALE_MAX, step: SCALE_STEP_DEFAULT };

// Dependency-free stepped scale: discrete buttons across the configured continuous range.
export const LinearScaleQuestion: React.FC<Props> = ({ value, config, errorMsg, updateAnswer, styles }) => {
  const bounds = resolveScaleBounds(config, LINEAR_FALLBACK);
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
