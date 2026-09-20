import type { ReactElement } from 'react';

import { Platform, Text } from 'react-native';

import { TestIds } from '../../../shared/testIds';
import { useTheme } from '../../../theme/hooks/useTheme';
import {
  MARKETING_WORDMARK_FONT_FAMILY,
  MARKETING_WORDMARK_LETTER_SPACING,
  MARKETING_WORDMARK_WEIGHT,
} from '../utils/brand';

interface Props {
  /** Translation key resolved by FM. Caller passes the resolved string. */
  text: string;
  /** Pixel size for the wordmark glyph. */
  size: number;
  /** Optional override colour — defaults to theme.colors.text. */
  color?: string;
}

/**
 * Multiplier applied to `size` to derive the wordmark's line height.
 *
 * In a React Native style `lineHeight` is an ABSOLUTE PIXEL value, not the unitless
 * CSS ratio. The previous `lineHeight: 1` therefore collapsed the <Text> box to 1px,
 * and the brand TouchableOpacity in LandingNavbar shrink-wrapped to a 1px hit box.
 */
const WORDMARK_LINE_HEIGHT_RATIO = 1.2;

/**
 * Per-app marketing wordmark.
 *
 * Renders the product name (e.g. "Erevna" / "Katalogos") in the locked brand font
 * (Outfit / Manrope respectively) with the locked weight + letter-spacing.
 *
 * On web the font-family is loaded via Google Fonts (see app/+html.tsx).
 * On native the font falls back to the system font — the wordmark is web-first.
 */
const Wordmark = ({ text, size, color }: Props): ReactElement => {
  const { theme } = useTheme();
  const resolvedColor = color ?? theme.colors.text;

  // React Native fontFamily on web accepts CSS-like stacks; on native it must be a single name.
  // We wrap in Platform.select so native gets a graceful fallback (no crash on missing font).
  const fontFamily = Platform.select({
    web: MARKETING_WORDMARK_FONT_FAMILY,
    default: undefined,
  });

  return (
    <Text
      style={{
          fontSize: size,
          lineHeight: size * WORDMARK_LINE_HEIGHT_RATIO,
          fontWeight: MARKETING_WORDMARK_WEIGHT,
          letterSpacing: MARKETING_WORDMARK_LETTER_SPACING,
          color: resolvedColor,
          fontFamily,
        }}
      testID={TestIds.LANDING_WORDMARK}
    >
      {text}
    </Text>
  );
};

export default Wordmark;
