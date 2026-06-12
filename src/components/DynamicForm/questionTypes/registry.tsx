/**
 * Light, open-closed registry of question types.
 *
 * Each entry maps a UI `QuestionType` to its API numeric type, label key, renderer and
 * (optional) validator. The renderer + builder drive off this map instead of hardcoded
 * `if (type === …)` chains, so adding a type is a single registry entry plus its component.
 *
 * Numeric API types come from `./apiTypes` (plain literals) — this shared `components/`
 * module must not import the product-specific generated `questioner` models.
 */
import React from 'react';

import { MATRIX_ENTRY, RANKING_ENTRY } from './advancedEntries';
import { API_QUESTION_TYPE } from './apiTypes';
import { LINEAR_SCALE_MAX, LINEAR_SCALE_MIN, RATING_MAX, RATING_MIN, SCALE_STEP_DEFAULT } from './constants';
import { asNumberOrNull, asString, defaultValidate, renderMultiEntry, renderOptionEntry } from './renderHelpers';
import QuestionType from '../../../shared/enums/QuestionType';
import { isValueDefined } from '../../../utils/is';
import { DateQuestion } from '../QuestionRenderer/components/DateQuestion';
import { DropdownQuestion } from '../QuestionRenderer/components/DropdownQuestion';
import { LinearScaleQuestion } from '../QuestionRenderer/components/LinearScaleQuestion';
import { NpsQuestion } from '../QuestionRenderer/components/NpsQuestion';
import { NumberQuestion } from '../QuestionRenderer/components/NumberQuestion';
import { RadioQuestion } from '../QuestionRenderer/components/RadioQuestion';
import { RatingQuestion } from '../QuestionRenderer/components/RatingQuestion';
import { TextQuestion } from '../QuestionRenderer/components/TextQuestion';

import type { QuestionTypeEntry } from './types';

const TEXT_ENTRY: QuestionTypeEntry = {
  uiType: QuestionType.Text,
  apiType: API_QUESTION_TYPE.Text,
  labelKey: 'Text',
  supportsOptions: false,
  validate: defaultValidate,
  render: ({ value, errorMsg, updateAnswer, styles }) => (
    <TextQuestion
      errorMsg={errorMsg}
      styles={styles}
      updateAnswer={(txt: string) => updateAnswer(txt)}
      value={asString(value)}
    />
  ),
};

const DROPDOWN_ENTRY: QuestionTypeEntry = {
  uiType: QuestionType.Dropdown,
  apiType: API_QUESTION_TYPE.Dropdown,
  labelKey: 'Dropdown',
  supportsOptions: true,
  validate: defaultValidate,
  render: (props) => renderOptionEntry(DropdownQuestion, props),
};

const RADIO_ENTRY: QuestionTypeEntry = {
  uiType: QuestionType.Radio,
  apiType: API_QUESTION_TYPE.Radio,
  labelKey: 'Radio',
  supportsOptions: true,
  validate: defaultValidate,
  render: (props) => renderOptionEntry(RadioQuestion, props),
};

const CHECKBOX_ENTRY: QuestionTypeEntry = {
  uiType: QuestionType.Checkbox,
  apiType: API_QUESTION_TYPE.Checkbox,
  labelKey: 'Checkbox',
  supportsOptions: true,
  validate: defaultValidate,
  render: renderMultiEntry,
};

const MULTIPLE_CHOICE_ENTRY: QuestionTypeEntry = {
  uiType: QuestionType.MultipleChoice,
  apiType: API_QUESTION_TYPE.MultipleChoice,
  labelKey: 'MultipleChoice',
  supportsOptions: true,
  validate: defaultValidate,
  render: renderMultiEntry,
};

const RATING_ENTRY: QuestionTypeEntry = {
  uiType: QuestionType.Rating,
  apiType: API_QUESTION_TYPE.Rating,
  labelKey: 'Rating',
  supportsOptions: false,
  defaultConfig: { scaleMin: RATING_MIN, scaleMax: RATING_MAX, scaleStep: SCALE_STEP_DEFAULT },
  validate: defaultValidate,
  render: ({ question, value, errorMsg, updateAnswer, styles }) => (
    <RatingQuestion
      config={question.config}
      errorMsg={errorMsg}
      styles={styles}
      updateAnswer={(v: number) => updateAnswer(v)}
      value={asNumberOrNull(value)}
    />
  ),
};

const NPS_ENTRY: QuestionTypeEntry = {
  uiType: QuestionType.Nps,
  apiType: API_QUESTION_TYPE.Nps,
  labelKey: 'Nps',
  supportsOptions: false,
  validate: defaultValidate,
  render: ({ question, value, errorMsg, updateAnswer, styles }) => (
    <NpsQuestion
      config={question.config}
      errorMsg={errorMsg}
      styles={styles}
      updateAnswer={(v: number) => updateAnswer(v)}
      value={asNumberOrNull(value)}
    />
  ),
};

const NUMBER_ENTRY: QuestionTypeEntry = {
  uiType: QuestionType.Number,
  apiType: API_QUESTION_TYPE.Number,
  labelKey: 'Number',
  supportsOptions: false,
  validate: defaultValidate,
  render: ({ value, errorMsg, updateAnswer, styles }) => (
    <NumberQuestion
      errorMsg={errorMsg}
      styles={styles}
      updateAnswer={(v: number | null) => updateAnswer(v ?? '')}
      value={asNumberOrNull(value)}
    />
  ),
};

const DATE_ENTRY: QuestionTypeEntry = {
  uiType: QuestionType.Date,
  apiType: API_QUESTION_TYPE.Date,
  labelKey: 'Date',
  supportsOptions: false,
  validate: defaultValidate,
  render: ({ value, errorMsg, updateAnswer, styles }) => (
    <DateQuestion
      errorMsg={errorMsg}
      styles={styles}
      updateAnswer={(v: string) => updateAnswer(v)}
      value={asString(value)}
    />
  ),
};

const LINEAR_SCALE_ENTRY: QuestionTypeEntry = {
  uiType: QuestionType.LinearScale,
  apiType: API_QUESTION_TYPE.LinearScale,
  labelKey: 'LinearScale',
  supportsOptions: false,
  defaultConfig: { scaleMin: LINEAR_SCALE_MIN, scaleMax: LINEAR_SCALE_MAX, scaleStep: SCALE_STEP_DEFAULT },
  validate: defaultValidate,
  render: ({ question, value, errorMsg, updateAnswer, styles }) => (
    <LinearScaleQuestion
      config={question.config}
      errorMsg={errorMsg}
      styles={styles}
      updateAnswer={(v: number) => updateAnswer(v)}
      value={asNumberOrNull(value)}
    />
  ),
};

const ENTRIES: readonly QuestionTypeEntry[] = [
  TEXT_ENTRY,
  MULTIPLE_CHOICE_ENTRY,
  CHECKBOX_ENTRY,
  RADIO_ENTRY,
  DROPDOWN_ENTRY,
  RATING_ENTRY,
  NPS_ENTRY,
  NUMBER_ENTRY,
  DATE_ENTRY,
  LINEAR_SCALE_ENTRY,
  RANKING_ENTRY,
  MATRIX_ENTRY,
];

const BY_UI_TYPE = new Map<QuestionType, QuestionTypeEntry>(ENTRIES.map((entry) => [entry.uiType, entry]));
const BY_API_TYPE = new Map<number, QuestionTypeEntry>(ENTRIES.map((entry) => [entry.apiType, entry]));

/** Look up the registry entry for a UI type (defaults to Text). */
export function getEntryByUiType(uiType: QuestionType): QuestionTypeEntry {
  return BY_UI_TYPE.get(uiType) ?? TEXT_ENTRY;
}

/** Look up the registry entry for an API numeric type (defaults to Text). */
export function getEntryByApiType(apiType: number | undefined): QuestionTypeEntry {
  if (!isValueDefined(apiType)) return TEXT_ENTRY;
  return BY_API_TYPE.get(apiType) ?? TEXT_ENTRY;
}

/** All registered entries (registration order). */
export function getAllEntries(): readonly QuestionTypeEntry[] {
  return ENTRIES;
}

/** Whether a UI type renders option rows (multiple-choice / radio / dropdown / checkbox). */
export function uiTypeSupportsOptions(uiType: QuestionType): boolean {
  return getEntryByUiType(uiType).supportsOptions;
}

export { FIXED_SCALE_API_TYPES, NUMERIC_API_TYPES, SCALE_API_TYPES } from './apiTypes';
