import ChangeSemanticKey from '@/shared/enums/ChangeSemanticKey';
import { isValueDefined } from '@/utils/is';

import type { MenuVersionDiff } from '../../types';

const ADDED_CHANGE_TYPE = 'Added';
const REMOVED_CHANGE_TYPE = 'Removed';

interface ChangeSummary {
  additions: number;
  removals: number;
  modifications: number;
}

export function formatVersionPath(path: string): string {
  return path
    .replace(/\[(\d+)\]/g, (_match, index: string) => ` ${String(Number(index) + 1)}`)
    .replace(/\./g, ' > ');
}

export function getChangeSemanticKey(changeType: string): ChangeSemanticKey {
  if (changeType === ADDED_CHANGE_TYPE) return ChangeSemanticKey.Success;
  if (changeType === REMOVED_CHANGE_TYPE) return ChangeSemanticKey.Error;
  return ChangeSemanticKey.Warning;
}

export function getChangeSummary(differences: MenuVersionDiff[]): ChangeSummary {
  let additions = 0;
  let removals = 0;
  let modifications = 0;

  for (const diff of differences)
    if (diff.changeType === ADDED_CHANGE_TYPE)
      additions++;
    else if (diff.changeType === REMOVED_CHANGE_TYPE)
      removals++;
    else
      modifications++;


  return { additions, removals, modifications };
}

export function truncateValue(value: string | null, maxLength: number): string {
  if (!isValueDefined(value)) return '-';
  if (value.length <= maxLength) return value;
  return `${value.slice(0, maxLength)}...`;
}
