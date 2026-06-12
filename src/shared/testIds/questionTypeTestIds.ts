/** Test IDs for advanced question types (Ranking, Matrix) and the survey embed widget. */
export const QuestionTypeTestIds = {
  // Ranking question — reorder controls (suffixed with the option value at runtime).
  RANKING_MOVE_UP: 'ranking-move-up',
  RANKING_MOVE_DOWN: 'ranking-move-down',

  // Matrix question — grid cell (suffixed with `-{rowId}-{colId}` at runtime).
  MATRIX_CELL: 'matrix-cell',

  // Matrix builder editor (rows + columns).
  MATRIX_EDITOR_ADD_ROW: 'matrix-editor-add-row',
  MATRIX_EDITOR_ADD_COLUMN: 'matrix-editor-add-column',
  MATRIX_EDITOR_ROW_INPUT: 'matrix-editor-row-input',
  MATRIX_EDITOR_COLUMN_INPUT: 'matrix-editor-column-input',
  MATRIX_EDITOR_REMOVE_ROW: 'matrix-editor-remove-row',
  MATRIX_EDITOR_REMOVE_COLUMN: 'matrix-editor-remove-column',

  // Survey embed widget (shares EmbedWidget components; modal-level ids).
  SURVEY_EMBED_WIDGET_MODAL: 'survey-embed-widget-modal',
  SURVEY_EMBED_WIDGET_BUTTON: 'survey-embed-widget-button',
  SURVEY_EMBED_PAGE: 'survey-embed-page',
} as const;
