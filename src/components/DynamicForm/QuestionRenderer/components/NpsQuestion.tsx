import React from 'react';

import { ScaleButtons } from './ScaleButtons';
import { NPS_MAX, NPS_MIN, SCALE_STEP_DEFAULT } from '../../questionTypes/constants';
import { buildScaleTicks } from '../../questionTypes/scaleHelpers';

import type { FormStyles } from '../../../../theme/utils/styles';
import type { QuestionConfig } from '../../interfaces';

interface Props {
  value: number | null;
  config?: QuestionConfig;
  errorMsg?: string;
  updateAnswer: (v: number) => void;
  styles: FormStyles;
}

// NPS is a fixed 0-10 scale; config only contributes endpoint labels.
const NPS_TICKS = buildScaleTicks({ min: NPS_MIN, max: NPS_MAX, step: SCALE_STEP_DEFAULT });

export const NpsQuestion: React.FC<Props> = ({ value, config, errorMsg, updateAnswer, styles }) => (
  <ScaleButtons
    errorMsg={errorMsg}
    maxLabel={config?.maxLabel ?? undefined}
    minLabel={config?.minLabel ?? undefined}
    styles={styles}
    ticks={NPS_TICKS}
    updateAnswer={updateAnswer}
    value={value}
  />
);
