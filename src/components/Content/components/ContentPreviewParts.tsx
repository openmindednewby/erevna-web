/**
 * Sub-components for ContentPreview.
 */
import React from 'react';

import { ActivityIndicator, Image, Text, View } from 'react-native';
import type { ViewStyle } from 'react-native';

import { FM } from '@/localization/helpers';

import ContentCategory from '../../../shared/enums/ContentCategory';
import { TestIds } from '../../../shared/testIds';
import { isValueDefined } from '../../../utils/is';
import { styles, getDocumentIcon } from '../utils/ContentPreviewStyles';


import type { ThemeStyles } from '../utils/ContentPreviewStyles';

interface ImagePreviewProps {
  displayUrl: string;
  displayFileName: string;
}

const ImagePreviewContent = ({ displayUrl, displayFileName }: ImagePreviewProps): React.JSX.Element => (
  <Image
    accessibilityIgnoresInvertColors
    accessibilityHint={FM('content.imagePreviewHint')}
    accessibilityLabel={FM('content.imagePreviewLabel', displayFileName)}
    resizeMode="cover"
    source={{ uri: displayUrl }}
    style={styles.previewImage}
    testID={TestIds.CONTENT_PREVIEW_IMAGE}
  />
);

interface VideoPreviewProps {
  displayUrl: string | undefined;
  displayFileName: string;
  themeStyles: ThemeStyles;
}

const VideoPreviewContent = ({ displayUrl, displayFileName, themeStyles }: VideoPreviewProps): React.JSX.Element => {
  if (isValueDefined(displayUrl))
    return (
      <Image
        accessibilityIgnoresInvertColors
        accessibilityHint={FM('content.videoThumbnailHint')}
        accessibilityLabel={FM('content.videoThumbnailLabel', displayFileName)}
        resizeMode="cover"
        source={{ uri: displayUrl }}
        style={styles.previewImage}
        testID={TestIds.CONTENT_PREVIEW_VIDEO_THUMBNAIL}
      />
    );


  return (
    <View style={styles.documentIconContainer}>
      <Text style={[styles.documentIcon, themeStyles.documentIcon]}>{FM('common.video')}</Text>
      <Text ellipsizeMode="middle" numberOfLines={2} style={[styles.documentName, themeStyles.documentName]}>
        {displayFileName}
      </Text>
    </View>
  );
};

interface DocumentPreviewProps {
  displayFileName: string;
  contentType: string;
  themeStyles: ThemeStyles;
}

export const DocumentPreviewContent = ({ displayFileName, contentType, themeStyles }: DocumentPreviewProps): React.JSX.Element => (
  <>
    <Text style={[styles.documentIcon, themeStyles.documentIcon]}>{getDocumentIcon(contentType)}</Text>
    <Text ellipsizeMode="middle" numberOfLines={2} style={[styles.documentName, themeStyles.documentName]}>
      {displayFileName}
    </Text>
  </>
);

interface PreviewContentRendererProps {
  isLoading: boolean;
  error: string | undefined;
  displayCategory: ContentCategory;
  displayUrl: string | undefined;
  displayFileName: string;
  themeStyles: ThemeStyles;
  primaryColor: string;
}

export const PreviewContentRenderer = ({
  isLoading,
  error,
  displayCategory,
  displayUrl,
  displayFileName,
  themeStyles,
  primaryColor,
}: PreviewContentRendererProps): React.ReactNode => {
  if (isLoading) 
    return <ActivityIndicator color={primaryColor} size="large" />;
  

  if (hasError(error)) 
    return <Text style={[styles.errorText, themeStyles.errorText]}>{error}</Text>;
  

  const isImage = displayCategory === ContentCategory.Image && isValueDefined(displayUrl);
  if (isImage)
    return <ImagePreviewContent displayFileName={displayFileName} displayUrl={displayUrl} />;


  if (displayCategory === ContentCategory.Video)
    return <VideoPreviewContent displayFileName={displayFileName} displayUrl={displayUrl} themeStyles={themeStyles} />;
  

  return null;
};

export function buildPreviewContainerStyles(
  themeStyles: ThemeStyles,
  isLoading: boolean,
  error: string | undefined,
  isDocumentPreview: boolean,
): ViewStyle[] {
  const styleArray: Array<ViewStyle | null> = [
    styles.previewContainer,
    themeStyles.previewContainer,
    isLoading ? styles.loadingContainer : null,
    hasError(error) ? styles.errorContainer : null,
    isDocumentPreview ? styles.documentIconContainer : null,
  ];
  return styleArray.filter((s): s is ViewStyle => isValueDefined(s));
}

function hasError(error: string | undefined): error is string {
  return isValueDefined(error) && error !== '';
}
