import CurrencyPosition from '../../../../types/enums/CurrencyPosition';
import FontWeight from '../../../../types/enums/FontWeight';



const SAMPLE_PRICE = 12.99;
const SAMPLE_CURRENCY = '$';

export const MIN_FONT_SIZE = 12;
export const MAX_FONT_SIZE = 32;
export const DEFAULT_FONT_SIZE = 18;

interface FontWeightOption {
  value: FontWeight;
  label: string;
}

export const FONT_WEIGHT_OPTIONS: FontWeightOption[] = [
  { value: FontWeight.Normal, label: 'Normal' },
  { value: FontWeight.W500, label: 'Medium' },
  { value: FontWeight.W600, label: 'Semibold' },
  { value: FontWeight.Bold, label: 'Bold' },
];

export function parseCurrencyPosition(position: string): CurrencyPosition {
  if (position === 'before') return CurrencyPosition.Before;
  if (position === 'after') return CurrencyPosition.After;
  return CurrencyPosition.Before;
}

export function formatPricePreview(
  showCurrency: boolean,
  currencyPosition: CurrencyPosition,
): string {
  const priceText = SAMPLE_PRICE.toFixed(2);
  if (!showCurrency) return priceText;
  if (currencyPosition === CurrencyPosition.Before) return `${SAMPLE_CURRENCY}${priceText}`;
  return `${priceText}${SAMPLE_CURRENCY}`;
}

export function getFontWeightLabel(fontWeight: FontWeight): string {
  const option = FONT_WEIGHT_OPTIONS.find((opt) => opt.value === fontWeight);
  return option?.label ?? 'Bold';
}
