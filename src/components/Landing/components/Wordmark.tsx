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
  text: string;
  size: number;
  color?: string;
}

const WORDMARK_LINE_HEIGHT_RATIO = 1.2;

const Wordmark = ({ text, size, color }: Props): ReactElement => {
  const { theme } = useTheme();
  const resolvedColor = color ?? theme.colors.text;

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
