/**
 * Re-export of the shared Field from @dloizides/ui-forms (added with ui-forms@1.6.0).
 * Theme is supplied app-wide via FeedbackUiAdapter (@dloizides/ui-feedback context).
 *
 * `FormField` is hard-wired to a text input, so any NON-text control (a dropdown, a chip
 * selector, a date picker) had no shared way to get a label and ended up misaligned next
 * to its `FormField` siblings — missing the ~21px label row and the 16px bottom margin.
 * `Field` is that shared shell: label row, required mark, error line and spacing.
 */
export { Field } from '@dloizides/ui-forms';
