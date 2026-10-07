


import React, { useMemo } from 'react';

import {
  ActivityIndicator,
  Image,
  StyleSheet,
  View,
} from 'react-native';
import type { DimensionValue, ImageStyle, StyleProp, ViewStyle } from 'react-native';

import { useContentUrl, usePublicContentUrl } from '../../../lib/hooks/content';
import { useTheme } from '../../../theme/hooks/useTheme';
import { isValueDefined } from '../../../utils/is';

import type { ContentUrlResponse } from '../../../lib/hooks/content';
import type { UseQueryResult } from '@tanstack/react-query';

const DEFAULT_HEIGHT = 150;
const DEFAULT_BORDER_RADIUS = 8;

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

interface Props {
  contentId: string | null | undefined;

  style?: StyleProp<ViewStyle>;

  imageStyle?: StyleProp<ImageStyle>;

  testID?: string;

  accessibilityLabel?: string;

  accessibilityHint?: string;

  width?: DimensionValue;

  height?: DimensionValue;

  borderRadius?: number;

  isPublic?: boolean;
}

interface UseContentImageUrlParams {
  contentId: string | undefined;
  isPublic: boolean;
}

interface LoadingStateProps {
  containerStyle: ViewStyle;
  style?: StyleProp<ViewStyle>;
  testID?: string;
  primaryColor: string;
}

interface ImageContentProps {
  containerStyle: ViewStyle;
  style?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
  testID?: string;
  accessibilityLabel?: string;
  accessibilityHint?: string;
  url: string;
  borderRadius: number;
}

function isValidContentId(contentId: string | null | undefined): contentId is string {
  return isValueDefined(contentId) && contentId !== '';
}

function hasValidUrl(urlData: ContentUrlResponse | undefined): urlData is ContentUrlResponse & { url: string } {
  return isValueDefined(urlData?.url) && urlData.url !== '';
}

function useContentImageUrl(params: UseContentImageUrlParams): UseQueryResult<ContentUrlResponse> {
  const { contentId, isPublic } = params;
  const publicQuery = usePublicContentUrl(isPublic ? contentId : undefined);
  const authenticatedQuery = useContentUrl(isPublic ? undefined : contentId);
  return isPublic ? publicQuery : authenticatedQuery;
}

function logPublicContentError(isPublic: boolean, isError: boolean, contentId: string | undefined, error: unknown): void {
  const shouldLog = isPublic && isError;
  if (!shouldLog) return;
  const errorMessage = error instanceof Error ? error.message : String(error);
  console.warn('[ContentImage] Public URL fetch failed:', { contentId, error: errorMessage });
}

const LoadingState = ({ containerStyle, style, testID, primaryColor }: LoadingStateProps): React.ReactElement => (
  <View
    style={[styles.container, styles.loadingContainer, containerStyle, style]}
    testID={testID}
  >
    <ActivityIndicator color={primaryColor} size="small" />
  </View>
);

const ImageContent = ({
  containerStyle,
  style,
  imageStyle,
  testID,
  accessibilityLabel,
  accessibilityHint,
  url,
  borderRadius,
}: ImageContentProps): React.ReactElement => (
  <View style={[styles.container, containerStyle, style]} testID={testID}>
    <Image
      accessibilityIgnoresInvertColors
      accessibilityHint={accessibilityHint ?? 'Displays content image'}
      accessibilityLabel={accessibilityLabel ?? 'Content image'}
      resizeMode="cover"
      source={{ uri: url }}
      style={[styles.image, { borderRadius }, imageStyle]}
    />
  </View>
);

export const ContentImage = ({
  contentId,
  style,
  imageStyle,
  testID,
  accessibilityLabel,
  accessibilityHint,
  width,
  height = DEFAULT_HEIGHT,
  borderRadius = DEFAULT_BORDER_RADIUS,
  isPublic = false,
}: Props): React.ReactElement | null => {
  const { theme } = useTheme();
  const surfaceColor = theme.colors.surface;
  const primary = theme.palette.primary['500'];
  const hasContentId = isValidContentId(contentId);
  const contentIdForQuery = hasContentId ? contentId : undefined;

  const imageUrlParams = useMemo(() => ({ contentId: contentIdForQuery, isPublic }), [contentIdForQuery, isPublic]);
  const queryResult = useContentImageUrl(imageUrlParams);
  const { data: urlData, isLoading, isError, error } = queryResult;

  logPublicContentError(isPublic, isError, contentIdForQuery, error);

  const containerStyle = useMemo<ViewStyle>(() => ({
    width: width ?? '100%',
    height,
    borderRadius,
    backgroundColor: surfaceColor,
  }), [width, height, borderRadius, surfaceColor]);

  if (!hasContentId) return null;

  if (isLoading)
    return <LoadingState containerStyle={containerStyle} primaryColor={primary} style={style} testID={testID} />;

  const shouldNotRender = isError || !hasValidUrl(urlData);
  if (shouldNotRender) {
    if (isPublic) console.warn('[ContentImage] Not rendering:', { contentId, isError, urlData });
    return null;
  }

  return (
    <ImageContent
      accessibilityHint={accessibilityHint}
      accessibilityLabel={accessibilityLabel}
      borderRadius={borderRadius}
      containerStyle={containerStyle}
      imageStyle={imageStyle}
      style={style}
      testID={testID}
      url={urlData.url}
    />
  );
};
