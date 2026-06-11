/** Pure helpers for building discrete scale tick values from question config. */
import { SCALE_STEP_DEFAULT } from './constants';

import type { QuestionConfig } from '../interfaces';

interface ScaleBounds {
  min: number;
  max: number;
  step: number;
}

const MAX_TICKS = 101;

/** Resolve effective scale bounds, falling back to the supplied defaults. */
export function resolveScaleBounds(config: QuestionConfig | undefined, fallback: ScaleBounds): ScaleBounds {
  const min = config?.scaleMin ?? fallback.min;
  const max = config?.scaleMax ?? fallback.max;
  const rawStep = config?.scaleStep ?? fallback.step;
  const step = rawStep > 0 ? rawStep : SCALE_STEP_DEFAULT;
  return { min, max, step };
}

/** Build the inclusive list of discrete tick values for a scale (capped for safety). */
export function buildScaleTicks(bounds: ScaleBounds): number[] {
  const { min, max, step } = bounds;
  if (max < min) return [min];
  const ticks: number[] = [];
  for (let value = min; value <= max && ticks.length < MAX_TICKS; value += step)
    ticks.push(value);
  return ticks;
}
