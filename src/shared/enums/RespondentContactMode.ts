/**
 * Mirrors the backend RespondentContactMode (stable numeric values). Controls
 * whether the public survey collects respondent name + email.
 */
const enum RespondentContactMode {
  Anonymous = 0,
  Optional = 1,
  Required = 2,
}

export default RespondentContactMode;
