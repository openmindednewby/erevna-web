import { FM } from '@/localization/helpers';

import MediaPosition from '../../../../types/enums/MediaPosition';
import { isValueDefined } from '../../../../utils/is';
import { DEFAULT_COLOR_SCHEME } from '../../../../utils/menuDefaults';

import type { MenuItem, MenuContents } from '../../../../types/menuTypes';

export function getMediaPosition(item: MenuItem): MediaPosition {
  return item.imageSettings?.position ?? MediaPosition.Left;
}

export function isHorizontalLayout(position: MediaPosition): boolean {
  return position === MediaPosition.Left || position === MediaPosition.Right;
}

export function getTextColor(item: MenuItem, globalStyles?: MenuContents): string {
  const itemTextColor = item.textColor ?? item.typography?.nameColor;
  const globalTextColor = globalStyles?.colorScheme?.text ?? globalStyles?.textColor;
  return itemTextColor ?? globalTextColor ?? DEFAULT_COLOR_SCHEME.text;
}

export function getBackgroundColor(item: MenuItem, globalStyles?: MenuContents): string {
  const itemBgColor = item.backgroundColor;
  const globalBgColor = globalStyles?.colorScheme?.surface;
  return itemBgColor ?? globalBgColor ?? DEFAULT_COLOR_SCHEME.background;
}

interface ResolvedItemDisplayProps {
  itemName: string;
  itemDescription: string | undefined;
  itemPrice: number;
  isAvailable: boolean;
  hasImage: boolean;
  hasDescription: boolean;
}

export function resolveItemDisplayProps(item: MenuItem): ResolvedItemDisplayProps {
  const itemName = item.name ?? FM('menuItem.defaultName');
  const itemDescription = item.description ?? undefined;
  const itemPrice = item.price ?? 0;
  const isAvailable = item.isAvailable ?? true;
  const hasImage = isValueDefined(item.imageContentId);
  const hasDescription = isValueDefined(itemDescription) && itemDescription !== '';
  return { itemName, itemDescription, itemPrice, isAvailable, hasImage, hasDescription };
}
