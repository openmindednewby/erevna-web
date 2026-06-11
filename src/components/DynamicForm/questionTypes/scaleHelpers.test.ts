/**
 * Tests for scale tick / bounds helpers.
 */
import { buildScaleTicks, resolveScaleBounds } from './scaleHelpers';

const FALLBACK = { min: 1, max: 5, step: 1 };

describe('scaleHelpers - resolveScaleBounds', () => {
  it('uses fallback when config is missing', () => {
    expect(resolveScaleBounds(undefined, FALLBACK)).toEqual({ min: 1, max: 5, step: 1 });
  });

  it('prefers config values when present', () => {
    expect(resolveScaleBounds({ scaleMin: 0, scaleMax: 10, scaleStep: 2 }, FALLBACK)).toEqual({ min: 0, max: 10, step: 2 });
  });

  it('coerces a non-positive step to the default', () => {
    expect(resolveScaleBounds({ scaleStep: 0 }, FALLBACK).step).toBe(1);
    expect(resolveScaleBounds({ scaleStep: -3 }, FALLBACK).step).toBe(1);
  });
});

describe('scaleHelpers - buildScaleTicks', () => {
  it('builds an inclusive list across the range', () => {
    expect(buildScaleTicks({ min: 1, max: 5, step: 1 })).toEqual([1, 2, 3, 4, 5]);
  });

  it('honors the step', () => {
    expect(buildScaleTicks({ min: 0, max: 10, step: 5 })).toEqual([0, 5, 10]);
  });

  it('returns a single tick when max < min', () => {
    expect(buildScaleTicks({ min: 5, max: 1, step: 1 })).toEqual([5]);
  });

  it('caps runaway ranges', () => {
    expect(buildScaleTicks({ min: 0, max: 100000, step: 1 }).length).toBeLessThanOrEqual(101);
  });
});
