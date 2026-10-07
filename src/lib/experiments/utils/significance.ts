const MIN_SAMPLE_SIZE = 30;
const PERCENTAGE_MULTIPLIER = 100;
const WINNING_THRESHOLD = 0.6;

const enum SignificanceResult {
  NotEnoughData = 'notEnoughData',
  VariantAWinning = 'variantAWinning',
  VariantBWinning = 'variantBWinning',
  NoClearWinner = 'noClearWinner',
}

export default SignificanceResult;

export function calculateSignificance(
  variantAViews: number,
  variantBViews: number,
): SignificanceResult {
  const totalViews = variantAViews + variantBViews;

  if (totalViews < MIN_SAMPLE_SIZE)
    return SignificanceResult.NotEnoughData;

  const proportionB = variantBViews / totalViews;
  const proportionA = variantAViews / totalViews;

  if (proportionB >= WINNING_THRESHOLD)
    return SignificanceResult.VariantBWinning;

  if (proportionA >= WINNING_THRESHOLD)
    return SignificanceResult.VariantAWinning;

  return SignificanceResult.NoClearWinner;
}

export function formatMetricPercentage(
  views: number,
  totalViews: number,
): string {
  if (totalViews === 0) return '0';
  return Math.round((views / totalViews) * PERCENTAGE_MULTIPLIER).toString();
}
