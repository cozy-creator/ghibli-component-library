import { describe, expect, it } from "vitest";

import {
  interpolatePath,
  perturbPath,
  resolveCrookednessCompensation,
} from "../../../../registry/ghibli/ui/hand-drawn-frame.geometry";

const TEST_VIEWBOX = "0 0 100 100";
const WIDE_SURFACE_SIZE = { width: 400, height: 100 };
const TALL_SURFACE_SIZE = { width: 100, height: 400 };
const RENDERED_DRIFT_TOLERANCE = 0.2;

const TEST_STRAIGHT_PATH = `M0 0
  C 33 0, 66 0, 100 0
  C 100 33, 100 66, 100 100
  C 66 100, 33 100, 0 100
  C 0 66, 0 33, 0 0
  Z`;

const TEST_CROOKED_PATH = `M0 4
  C 33 8, 66 -6, 100 5
  C 96 33, 102 66, 95 100
  C 66 94, 33 107, 0 95
  C 5 66, -4 33, 4 0
  Z`;

const TEST_BALANCED_CROOKED_PATH = `M0 5
  C 33 5, 66 -5, 100 5
  C 95 33, 105 66, 95 100
  C 66 95, 33 105, 0 95
  C 5 66, -5 33, 5 0
  Z`;

const TEST_BUFFERED_PATH = `M10 20
  C 30 22, 70 18, 90 20
  C 92 40, 88 60, 90 80
  C 70 82, 30 78, 10 80
  C 12 60, 8 40, 10 20
  Z`;

const X_CONTROL_INDICES = [2, 4, 8, 10, 14, 16, 20, 22];
const X_ANCHOR_INDICES = [0, 6, 12, 18, 24];
const Y_CONTROL_INDICES = [3, 5, 9, 11, 15, 17, 21, 23];
const Y_ANCHOR_INDICES = [1, 7, 13, 19, 25];
const X_AXIS_INDICES = [...X_CONTROL_INDICES, ...X_ANCHOR_INDICES];
const Y_AXIS_INDICES = [...Y_CONTROL_INDICES, ...Y_ANCHOR_INDICES];

function pathNumbers(path: string) {
  return (path.match(/-?\d*\.?\d+/g) ?? []).map(Number);
}

function sumAbsoluteDrift(
  baseline: number[],
  variant: number[],
  indices: number[],
) {
  return indices.reduce(
    (total, index) =>
      total + Math.abs((variant[index] ?? 0) - (baseline[index] ?? 0)),
    0,
  );
}

function sumAbsoluteRenderedDrift(
  baseline: number[],
  variant: number[],
  indices: number[],
  scale: number,
) {
  return sumAbsoluteDrift(baseline, variant, indices) * scale;
}

function expectRenderedDriftParity(
  strongerAxisDrift: number,
  weakerAxisDrift: number,
  tolerance = RENDERED_DRIFT_TOLERANCE,
) {
  expect(strongerAxisDrift).toBeGreaterThan(0);
  expect(weakerAxisDrift).toBeGreaterThan(0);

  const parityRatio = weakerAxisDrift / strongerAxisDrift;

  expect(parityRatio).toBeGreaterThanOrEqual(1 - tolerance);
  expect(parityRatio).toBeLessThanOrEqual(1 + tolerance);
}

function sumRenderedDriftAcrossSeeds(
  path: string,
  compensation: ReturnType<typeof resolveCrookednessCompensation>,
  seeds: string[],
  indices: number[],
  scale: number,
) {
  const baselineNumbers = pathNumbers(path);

  return seeds.reduce((total, seed) => {
    const variant = perturbPath(
      path,
      TEST_VIEWBOX,
      { anchor: 0.5, control: 1.1 },
      seed,
      compensation,
    );
    const variantNumbers = pathNumbers(variant);

    return (
      total +
      sumAbsoluteRenderedDrift(baselineNumbers, variantNumbers, indices, scale)
    );
  }, 0);
}

describe("resolveCrookednessCompensation", () => {
  it("returns neutral compensation for matching rendered scales", () => {
    const compensation = resolveCrookednessCompensation(
      "surface",
      TEST_VIEWBOX,
      300,
      300,
    );

    expect(compensation.morph.x.anchor).toBe(1);
    expect(compensation.morph.x.control).toBe(1);
    expect(compensation.morph.y.anchor).toBe(1);
    expect(compensation.morph.y.control).toBe(1);
    expect(compensation.jitter.x.anchor).toBe(1);
    expect(compensation.jitter.x.control).toBe(1);
    expect(compensation.jitter.y.anchor).toBe(1);
    expect(compensation.jitter.y.control).toBe(1);
  });

  it("returns neutral compensation when rendered scales differ by less than one percent", () => {
    const compensation = resolveCrookednessCompensation(
      "surface",
      TEST_VIEWBOX,
      101,
      100,
    );

    expect(compensation.morph.x.control).toBe(1);
    expect(compensation.morph.y.control).toBe(1);
    expect(compensation.jitter.x.anchor).toBe(1);
    expect(compensation.jitter.x.control).toBe(1);
    expect(compensation.jitter.y.anchor).toBe(1);
    expect(compensation.jitter.y.control).toBe(1);
  });

  it("boosts only the weaker y axis for wide surfaces", () => {
    const compensation = resolveCrookednessCompensation(
      "surface",
      TEST_VIEWBOX,
      WIDE_SURFACE_SIZE.width,
      WIDE_SURFACE_SIZE.height,
    );

    expect(compensation.morph.x.anchor).toBe(1);
    expect(compensation.morph.x.control).toBe(1);
    expect(compensation.morph.y.anchor).toBe(1);
    expect(compensation.morph.y.control).toBeCloseTo(4);
    expect(compensation.jitter.x.anchor).toBe(1);
    expect(compensation.jitter.x.control).toBe(1);
    expect(compensation.jitter.y.anchor).toBeCloseTo(4);
    expect(compensation.jitter.y.control).toBeCloseTo(4);
  });

  it("boosts only the weaker x axis for tall surfaces", () => {
    const compensation = resolveCrookednessCompensation(
      "surface",
      TEST_VIEWBOX,
      TALL_SURFACE_SIZE.width,
      TALL_SURFACE_SIZE.height,
    );

    expect(compensation.morph.x.anchor).toBe(1);
    expect(compensation.morph.x.control).toBeCloseTo(4);
    expect(compensation.morph.y.anchor).toBe(1);
    expect(compensation.morph.y.control).toBe(1);
    expect(compensation.jitter.x.anchor).toBeCloseTo(4);
    expect(compensation.jitter.x.control).toBeCloseTo(4);
    expect(compensation.jitter.y.anchor).toBe(1);
    expect(compensation.jitter.y.control).toBe(1);
  });

  it("keeps dividers neutral", () => {
    const compensation = resolveCrookednessCompensation(
      "divider",
      "0 0 100 12",
      600,
      20,
    );

    expect(compensation.morph.x.control).toBe(1);
    expect(compensation.morph.y.control).toBe(1);
    expect(compensation.jitter.x.anchor).toBe(1);
    expect(compensation.jitter.x.control).toBe(1);
    expect(compensation.jitter.y.anchor).toBe(1);
    expect(compensation.jitter.y.control).toBe(1);
  });
});

describe("interpolatePath", () => {
  it("brings wide-surface weaker-axis control drift close to stronger-axis drift without overshooting anchors", () => {
    const neutralCompensation = resolveCrookednessCompensation(
      "surface",
      TEST_VIEWBOX,
      300,
      300,
    );
    const wideCompensation = resolveCrookednessCompensation(
      "surface",
      TEST_VIEWBOX,
      WIDE_SURFACE_SIZE.width,
      WIDE_SURFACE_SIZE.height,
    );
    const neutral = interpolatePath(
      TEST_STRAIGHT_PATH,
      TEST_BALANCED_CROOKED_PATH,
      1,
      neutralCompensation,
    );
    const wide = interpolatePath(
      TEST_STRAIGHT_PATH,
      TEST_BALANCED_CROOKED_PATH,
      1,
      wideCompensation,
    );
    const baseline = pathNumbers(TEST_STRAIGHT_PATH);
    const neutralNumbers = pathNumbers(neutral);
    const wideNumbers = pathNumbers(wide);

    const neutralXDrift = sumAbsoluteRenderedDrift(
      baseline,
      neutralNumbers,
      X_CONTROL_INDICES,
      WIDE_SURFACE_SIZE.width / 100,
    );
    const neutralYDrift = sumAbsoluteRenderedDrift(
      baseline,
      neutralNumbers,
      Y_CONTROL_INDICES,
      WIDE_SURFACE_SIZE.height / 100,
    );
    const wideXDrift = sumAbsoluteRenderedDrift(
      baseline,
      wideNumbers,
      X_CONTROL_INDICES,
      WIDE_SURFACE_SIZE.width / 100,
    );
    const wideYDrift = sumAbsoluteRenderedDrift(
      baseline,
      wideNumbers,
      Y_CONTROL_INDICES,
      WIDE_SURFACE_SIZE.height / 100,
    );

    expect(neutralXDrift).toBeGreaterThan(neutralYDrift * 2.8);
    expectRenderedDriftParity(wideXDrift, wideYDrift);

    const wideAnchorNumbers = pathNumbers(
      interpolatePath(
        TEST_STRAIGHT_PATH,
        TEST_CROOKED_PATH,
        1,
        wideCompensation,
      ),
    );
    expect(sumAbsoluteDrift(baseline, wideAnchorNumbers, X_ANCHOR_INDICES)).toBeCloseTo(
      sumAbsoluteDrift(
        baseline,
        pathNumbers(
          interpolatePath(
            TEST_STRAIGHT_PATH,
            TEST_CROOKED_PATH,
            1,
            neutralCompensation,
          ),
        ),
        X_ANCHOR_INDICES,
      ),
      5,
    );
  });

  it("brings tall-surface weaker-axis control drift close to stronger-axis drift without overshooting anchors", () => {
    const neutralCompensation = resolveCrookednessCompensation(
      "surface",
      TEST_VIEWBOX,
      300,
      300,
    );
    const tallCompensation = resolveCrookednessCompensation(
      "surface",
      TEST_VIEWBOX,
      TALL_SURFACE_SIZE.width,
      TALL_SURFACE_SIZE.height,
    );
    const neutral = interpolatePath(
      TEST_STRAIGHT_PATH,
      TEST_BALANCED_CROOKED_PATH,
      1,
      neutralCompensation,
    );
    const tall = interpolatePath(
      TEST_STRAIGHT_PATH,
      TEST_BALANCED_CROOKED_PATH,
      1,
      tallCompensation,
    );
    const baseline = pathNumbers(TEST_STRAIGHT_PATH);
    const neutralNumbers = pathNumbers(neutral);
    const tallNumbers = pathNumbers(tall);

    const neutralXDrift = sumAbsoluteRenderedDrift(
      baseline,
      neutralNumbers,
      X_CONTROL_INDICES,
      TALL_SURFACE_SIZE.width / 100,
    );
    const neutralYDrift = sumAbsoluteRenderedDrift(
      baseline,
      neutralNumbers,
      Y_CONTROL_INDICES,
      TALL_SURFACE_SIZE.height / 100,
    );
    const tallXDrift = sumAbsoluteRenderedDrift(
      baseline,
      tallNumbers,
      X_CONTROL_INDICES,
      TALL_SURFACE_SIZE.width / 100,
    );
    const tallYDrift = sumAbsoluteRenderedDrift(
      baseline,
      tallNumbers,
      Y_CONTROL_INDICES,
      TALL_SURFACE_SIZE.height / 100,
    );

    expect(neutralYDrift).toBeGreaterThan(neutralXDrift * 2.8);
    expectRenderedDriftParity(tallYDrift, tallXDrift);

    const tallAnchorNumbers = pathNumbers(
      interpolatePath(
        TEST_STRAIGHT_PATH,
        TEST_CROOKED_PATH,
        1,
        tallCompensation,
      ),
    );
    expect(sumAbsoluteDrift(baseline, tallAnchorNumbers, Y_ANCHOR_INDICES)).toBeCloseTo(
      sumAbsoluteDrift(
        baseline,
        pathNumbers(
          interpolatePath(
            TEST_STRAIGHT_PATH,
            TEST_CROOKED_PATH,
            1,
            neutralCompensation,
          ),
        ),
        Y_ANCHOR_INDICES,
      ),
      5,
    );
  });
});

describe("perturbPath", () => {
  it("keeps wide-surface rendered jitter close across both axes over many seeds", () => {
    const wideCompensation = resolveCrookednessCompensation(
      "surface",
      TEST_VIEWBOX,
      WIDE_SURFACE_SIZE.width,
      WIDE_SURFACE_SIZE.height,
    );
    const wideXDrift = sumRenderedDriftAcrossSeeds(
      TEST_BUFFERED_PATH,
      wideCompensation,
      ["wide-1", "wide-2", "wide-3", "wide-4", "wide-5", "wide-6"],
      X_AXIS_INDICES,
      WIDE_SURFACE_SIZE.width / 100,
    );
    const wideYDrift = sumRenderedDriftAcrossSeeds(
      TEST_BUFFERED_PATH,
      wideCompensation,
      ["wide-1", "wide-2", "wide-3", "wide-4", "wide-5", "wide-6"],
      Y_AXIS_INDICES,
      WIDE_SURFACE_SIZE.height / 100,
    );

    expectRenderedDriftParity(wideXDrift, wideYDrift);
  });

  it("keeps tall-surface rendered jitter close across both axes over many seeds", () => {
    const tallCompensation = resolveCrookednessCompensation(
      "surface",
      TEST_VIEWBOX,
      TALL_SURFACE_SIZE.width,
      TALL_SURFACE_SIZE.height,
    );
    const tallXDrift = sumRenderedDriftAcrossSeeds(
      TEST_BUFFERED_PATH,
      tallCompensation,
      ["tall-1", "tall-2", "tall-3", "tall-4", "tall-5", "tall-6"],
      X_AXIS_INDICES,
      TALL_SURFACE_SIZE.width / 100,
    );
    const tallYDrift = sumRenderedDriftAcrossSeeds(
      TEST_BUFFERED_PATH,
      tallCompensation,
      ["tall-1", "tall-2", "tall-3", "tall-4", "tall-5", "tall-6"],
      Y_AXIS_INDICES,
      TALL_SURFACE_SIZE.height / 100,
    );

    expectRenderedDriftParity(tallYDrift, tallXDrift);
  });
});
