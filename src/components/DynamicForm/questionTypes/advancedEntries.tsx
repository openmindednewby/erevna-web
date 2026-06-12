/**
 * Registry entries for the advanced question types (Ranking, Matrix).
 *
 * Kept out of `registry.tsx` so that file stays under the line limit. Both reuse the
 * shared `multiValues` array answer shape — Ranking as an ordered list of option values,
 * Matrix as `"rowId:colId"` strings — so they need no backend Answer change.
 */
import React from 'react';

import { API_QUESTION_TYPE } from './apiTypes';
import { asArray, matrixValidate, rankingValidate } from './renderHelpers';
import QuestionType from '../../../shared/enums/QuestionType';
import { MatrixQuestion } from '../QuestionRenderer/components/MatrixQuestion';
import { RankingQuestion } from '../QuestionRenderer/components/RankingQuestion';

import type { QuestionTypeEntry } from './types';

export const RANKING_ENTRY: QuestionTypeEntry = {
  uiType: QuestionType.Ranking,
  apiType: API_QUESTION_TYPE.Ranking,
  labelKey: 'Ranking',
  supportsOptions: true,
  validate: rankingValidate,
  render: ({ question, value, errorMsg, updateAnswer, styles }) => {
    const options = question.options ?? [];
    if (options.length === 0) return null;
    return (
      <RankingQuestion
        errorMsg={errorMsg}
        options={options}
        styles={styles}
        updateAnswer={(ordered: string[]) => updateAnswer(ordered)}
        value={asArray(value)}
      />
    );
  },
};

export const MATRIX_ENTRY: QuestionTypeEntry = {
  uiType: QuestionType.Matrix,
  apiType: API_QUESTION_TYPE.Matrix,
  labelKey: 'Matrix',
  supportsOptions: true,
  validate: matrixValidate,
  render: ({ question, value, errorMsg, updateAnswer, styles }) => {
    const options = question.options ?? [];
    if (options.length === 0) return null;
    return (
      <MatrixQuestion
        errorMsg={errorMsg}
        options={options}
        styles={styles}
        updateAnswer={(encoded: string[]) => updateAnswer(encoded)}
        value={asArray(value)}
      />
    );
  },
};
