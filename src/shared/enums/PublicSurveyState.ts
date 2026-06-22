/** Screen state for the public survey respondent route. */
const enum PublicSurveyState {
  Loading = 'loading',
  NotFound = 'notFound',
  Error = 'error',
  Ready = 'ready',
  /** Survey exists and is active but no longer accepting responses (date/quota). */
  Closed = 'closed',
}

export default PublicSurveyState;
