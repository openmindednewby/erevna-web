import type {
  VariantGroup,
  Variant,
  ModifierGroup,
  Modifier,
  MenuItem,
} from '../../../types/menuTypes';

const DEFAULT_VARIANT_PRICE = 0;
const DEFAULT_MODIFIER_PRICE = 0;
const DEFAULT_MIN_SELECTIONS = 1;
const DEFAULT_MAX_SELECTIONS = 1;
const MODIFIER_DEFAULT_MIN = 0;
const MODIFIER_DEFAULT_MAX = 3;

export function createVariantGroup(name: string): VariantGroup {
  return {
    name,
    displayOrder: 0,
    isRequired: true,
    minSelections: DEFAULT_MIN_SELECTIONS,
    maxSelections: DEFAULT_MAX_SELECTIONS,
    variants: [],
  };
}

export function createVariant(name: string, price: number = DEFAULT_VARIANT_PRICE): Variant {
  return {
    name,
    price,
    displayOrder: 0,
    isAvailable: true,
  };
}

export function addVariantGroup(
  existingGroups: VariantGroup[] | undefined,
  group: VariantGroup,
): VariantGroup[] {
  const groups = existingGroups ?? [];
  return [...groups, { ...group, displayOrder: groups.length }];
}

export function removeVariantGroup(
  groups: VariantGroup[] | undefined,
  groupIndex: number,
): VariantGroup[] {
  if (!groups) return [];
  return groups.filter((_, i) => i !== groupIndex);
}

export function updateVariantGroup(
  groups: VariantGroup[] | undefined,
  groupIndex: number,
  updates: Partial<VariantGroup>,
): VariantGroup[] {
  if (!groups) return [];
  return groups.map((g, i) => (i === groupIndex ? { ...g, ...updates } : g));
}

export function addVariantToGroup(
  groups: VariantGroup[] | undefined,
  groupIndex: number,
  variant: Variant,
): VariantGroup[] {
  if (!groups) return [];
  return groups.map((g, i) => {
    if (i !== groupIndex) return g;
    const variants = g.variants ?? [];
    return { ...g, variants: [...variants, { ...variant, displayOrder: variants.length }] };
  });
}

export function removeVariantFromGroup(
  groups: VariantGroup[] | undefined,
  groupIndex: number,
  variantIndex: number,
): VariantGroup[] {
  if (!groups) return [];
  return groups.map((g, i) => {
    if (i !== groupIndex) return g;
    const variants = (g.variants ?? []).filter((_, vi) => vi !== variantIndex);
    return { ...g, variants };
  });
}

export function updateVariantInGroup(
  groups: VariantGroup[] | undefined,
  groupIndex: number,
  variantIndex: number,
  updates: Partial<Variant>,
): VariantGroup[] {
  if (!groups) return [];
  return groups.map((g, i) => {
    if (i !== groupIndex) return g;
    const variants = (g.variants ?? []).map((v, vi) =>
      vi === variantIndex ? { ...v, ...updates } : v,
    );
    return { ...g, variants };
  });
}

export function createModifierGroup(name: string): ModifierGroup {
  return {
    name,
    displayOrder: 0,
    isRequired: false,
    minSelections: MODIFIER_DEFAULT_MIN,
    maxSelections: MODIFIER_DEFAULT_MAX,
    modifiers: [],
  };
}

export function createModifier(
  name: string,
  priceAdjustment: number = DEFAULT_MODIFIER_PRICE,
): Modifier {
  return {
    name,
    priceAdjustment,
    displayOrder: 0,
    isAvailable: true,
  };
}

export function addModifierGroup(
  existingGroups: ModifierGroup[] | undefined,
  group: ModifierGroup,
): ModifierGroup[] {
  const groups = existingGroups ?? [];
  return [...groups, { ...group, displayOrder: groups.length }];
}

export function removeModifierGroup(
  groups: ModifierGroup[] | undefined,
  groupIndex: number,
): ModifierGroup[] {
  if (!groups) return [];
  return groups.filter((_, i) => i !== groupIndex);
}

export function updateModifierGroup(
  groups: ModifierGroup[] | undefined,
  groupIndex: number,
  updates: Partial<ModifierGroup>,
): ModifierGroup[] {
  if (!groups) return [];
  return groups.map((g, i) => (i === groupIndex ? { ...g, ...updates } : g));
}

export function addModifierToGroup(
  groups: ModifierGroup[] | undefined,
  groupIndex: number,
  modifier: Modifier,
): ModifierGroup[] {
  if (!groups) return [];
  return groups.map((g, i) => {
    if (i !== groupIndex) return g;
    const modifiers = g.modifiers ?? [];
    return { ...g, modifiers: [...modifiers, { ...modifier, displayOrder: modifiers.length }] };
  });
}

export function removeModifierFromGroup(
  groups: ModifierGroup[] | undefined,
  groupIndex: number,
  modifierIndex: number,
): ModifierGroup[] {
  if (!groups) return [];
  return groups.map((g, i) => {
    if (i !== groupIndex) return g;
    const modifiers = (g.modifiers ?? []).filter((_, mi) => mi !== modifierIndex);
    return { ...g, modifiers };
  });
}

export function updateModifierInGroup(
  groups: ModifierGroup[] | undefined,
  groupIndex: number,
  modifierIndex: number,
  updates: Partial<Modifier>,
): ModifierGroup[] {
  if (!groups) return [];
  return groups.map((g, i) => {
    if (i !== groupIndex) return g;
    const modifiers = (g.modifiers ?? []).map((m, mi) =>
      mi === modifierIndex ? { ...m, ...updates } : m,
    );
    return { ...g, modifiers };
  });
}

export function getMinVariantPrice(item: MenuItem): number | undefined {
  const groups = item.variantGroups;
  if (!groups || groups.length === 0) return undefined;

  const allVariants = groups.flatMap((g) => g.variants ?? []);
  const availableVariants = allVariants.filter((v) => v.isAvailable !== false);
  if (availableVariants.length === 0) return undefined;

  return Math.min(...availableVariants.map((v) => v.price));
}

export function hasVariants(item: MenuItem): boolean {
  const groups = item.variantGroups;
  if (!groups || groups.length === 0) return false;
  return groups.some((g) => (g.variants ?? []).length > 0);
}

export function hasModifiers(item: MenuItem): boolean {
  const groups = item.modifierGroups;
  if (!groups || groups.length === 0) return false;
  return groups.some((g) => (g.modifiers ?? []).length > 0);
}

export function formatPriceAdjustment(amount: number): string {
  const prefix = amount >= 0 ? '+' : '-';
  return `${prefix}$${Math.abs(amount).toFixed(2)}`;
}
