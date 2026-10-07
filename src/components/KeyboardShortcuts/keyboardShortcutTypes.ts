/** Type definitions for the keyboard shortcuts system. */

export type { KeyboardShortcut } from '@dloizides/rn-web-hooks';

/** A category grouping shortcuts for display in the help modal. */
export interface ShortcutCategory {
  /** Translation key for the category title. */
  titleKey: string;
  /** Shortcuts in this category. */
  shortcuts: ShortcutDisplayInfo[];
}

/** Display-only info for a shortcut (no handler). */
export interface ShortcutDisplayInfo {
  /** Translation key for the shortcut description. */
  labelKey: string;
  /** Human-readable key combination strings (e.g. ["Ctrl+S"]). */
  keyCombinations: string[];
}
