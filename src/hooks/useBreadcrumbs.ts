import { usePathname } from 'expo-router';

import { BREADCRUMB_MAP } from '../navigation/breadcrumbMap';
import { isValueDefined } from '../utils/is';

import type { BreadcrumbItem } from '../navigation/breadcrumbMap';

export function useBreadcrumbs(dynamicLabel?: string): BreadcrumbItem[] {
  const pathname = usePathname();
  const crumbs: BreadcrumbItem[] | undefined = BREADCRUMB_MAP[pathname];

  if (!isValueDefined(crumbs)) return [];

  const hasNonEmptyDynamicLabel = isValueDefined(dynamicLabel) && dynamicLabel !== '';
  const hasDynamicLabel = hasNonEmptyDynamicLabel && crumbs.length > 0;
  if (hasDynamicLabel) {
    const withOverride = [...crumbs];
    const lastIndex = withOverride.length - 1;
    withOverride[lastIndex] = { ...withOverride[lastIndex], labelKey: dynamicLabel };
    return withOverride;
  }

  return crumbs;
}
