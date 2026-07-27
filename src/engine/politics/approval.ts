import type { GameState } from "../../models/GameState";

const APPROVAL_LIMITS = {
  minimum: 0,
  maximum: 100,
} as const;

function clamp(
  value: number,
  minimum: number,
  maximum: number
): number {
  return Math.min(
    maximum,
    Math.max(minimum, value)
  );
}

function safeNumber(
  value: number,
  fallback: number
): number {
  return Number.isFinite(value)
    ? value
    : fallback;
}

function randomShock(
  range: number,
  random: () => number
): number {
  return (random() - 0.5) * range;
}

export function updateApproval(
  previous: GameState,
  current: GameState,
  random: () => number = Math.random
): GameState {
  const previousGdp = safeNumber(
    previous.gdp,
    100
  );

  const previousInflation = safeNumber(
    previous.inflation,
    2
  );

  const previousUnemployment = safeNumber(
    previous.unemployment,
    5
  );

  const currentGdp = safeNumber(
    current.gdp,
    previousGdp
  );

  const currentInflation = safeNumber(
    current.inflation,
    previousInflation
  );

  const currentUnemployment = safeNumber(
    current.unemployment,
    previousUnemployment
  );

  const currentApproval = safeNumber(
    current.approval,
    50
  );

  const incomeTax = safeNumber(
    current.incomeTax,
    25
  );

  const gdpChange =
    currentGdp - previousGdp;

  const inflationChange =
    currentInflation -
    previousInflation;

  const unemploymentChange =
    currentUnemployment -
    previousUnemployment;

  let approvalChange =
    gdpChange * 0.35 -
    inflationChange * 4 -
    unemploymentChange * 5;

  if (incomeTax > 35) {
    approvalChange -=
      (incomeTax - 35) * 0.25;
  }

  if (
    incomeTax >= 15 &&
    incomeTax <= 30
  ) {
    approvalChange += 0.5;
  }

  if (currentInflation > 6) {
    approvalChange -=
      (currentInflation - 6) * 0.75;
  }

  if (currentUnemployment > 8) {
    approvalChange -=
      currentUnemployment - 8;
  }

  approvalChange += randomShock(
    1.5,
    random
  );

  return {
    ...current,
    approval: clamp(
      currentApproval + approvalChange,
      APPROVAL_LIMITS.minimum,
      APPROVAL_LIMITS.maximum
    ),
  };
}