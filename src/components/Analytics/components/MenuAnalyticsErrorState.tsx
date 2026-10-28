import React from 'react';

import { View } from 'react-native';

import { ErrorState } from '@dloizides/ui-feedback';

import { FM } from '@/localization/helpers';
import { TestIds } from '@/shared/testIds';
import { useTheme } from '@/theme/hooks/useTheme';
import { layoutStyles } from '@/theme/utils/styles';

interface MenuAnalyticsErrorStateProps {
  backButton: React.ReactElement;
  onRetry: () => void;
  error?: unknown;
}

const MenuAnalyticsErrorState = ({
  backButton,
  onRetry,
  error,
}: MenuAnalyticsErrorStateProps): React.ReactElement => {
  const { theme } = useTheme();

  return (
    <View
      style={[layoutStyles.container, { backgroundColor: theme.colors.background }]}
      testID={TestIds.MENU_ANALYTICS_SCREEN}
    >
      {backButton}
      <ErrorState
        error={error}
        message={FM('analytics.detail.error')}
        testID={TestIds.MENU_ANALYTICS_ERROR}
        onRetry={onRetry}
      />
    </View>
  );
};

export default MenuAnalyticsErrorState;
