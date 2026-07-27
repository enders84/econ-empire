import type { GameState } from "../../models/GameState";

const ECONOMY_LIMITS = {
  gdp: {
    minimum: 100,
    maximum: 1_000_000,
  },
  inflation: {
    minimum: -2,
    maximum: 30,
  },
  unemployment: {
    minimum: 2,
    maximum: 35,
  },
} as const;

const NEUTRAL_LEVELS = {
  spending: 150,
  interestRate: 3,
  incomeTax: 25,
  unemployment: 5,
  inflationTarget: 2,
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

export function updateEconomy(
  state: GameState,
  random: () => number = Math.random
): GameState {
  const currentGdp = safeNumber(state.gdp, 100);

  const currentInflation = safeNumber(
    state.inflation,
    2
  );

  const currentUnemployment = safeNumber(
    state.unemployment,
    5
  );

  const incomeTax = safeNumber(
    state.incomeTax,
    NEUTRAL_LEVELS.incomeTax
  );

  const interestRate = safeNumber(
    state.interestRate,
    NEUTRAL_LEVELS.interestRate
  );

  const educationSpending = safeNumber(
    state.educationSpending,
    0
  );

  const healthcareSpending = safeNumber(
    state.healthcareSpending,
    0
  );

  const defenseSpending = safeNumber(
    state.defenseSpending,
    0
  );

  const infrastructureSpending = safeNumber(
    state.infrastructureSpending,
    0
  );

  const scienceSpending = safeNumber(
    state.scienceSpending,
    0
  );

  const totalSpending =
    educationSpending +
    healthcareSpending +
    defenseSpending +
    infrastructureSpending +
    scienceSpending;

  const spendingPressure =
    (totalSpending -
      NEUTRAL_LEVELS.spending) /
    50;

  const interestRatePressure =
    interestRate -
    NEUTRAL_LEVELS.interestRate;

  const taxPressure =
    incomeTax -
    NEUTRAL_LEVELS.incomeTax;

  const productiveInvestment =
    infrastructureSpending * 0.004 +
    educationSpending * 0.002 +
    scienceSpending * 0.003;

  const gdpShock = randomShock(1.5, random);

  const inflationShock = randomShock(
    0.12,
    random
  );

  const unemploymentShock = randomShock(
    0.12,
    random
  );

  const gdpChange =
    0.6 +
    spendingPressure * 0.9 -
    interestRatePressure * 0.35 -
    taxPressure * 0.07 +
    productiveInvestment +
    gdpShock;

  const spendingInflationEffect =
    spendingPressure * 0.18;

  const interestRateInflationEffect =
    interestRatePressure * -0.16;

  const taxInflationEffect =
    taxPressure * -0.025;

  const laborInflationEffect =
    (currentUnemployment -
      NEUTRAL_LEVELS.unemployment) *
    -0.06;

  const inflationTargetEffect =
    (NEUTRAL_LEVELS.inflationTarget -
      currentInflation) *
    0.08;

  const inflationChange =
    spendingInflationEffect +
    interestRateInflationEffect +
    taxInflationEffect +
    laborInflationEffect +
    inflationTargetEffect +
    inflationShock;

  const unemploymentChange =
    gdpChange * -0.055 -
    spendingPressure * 0.05 +
    interestRatePressure * 0.04 +
    unemploymentShock;

  return {
    ...state,

    gdp: clamp(
      currentGdp + gdpChange,
      ECONOMY_LIMITS.gdp.minimum,
      ECONOMY_LIMITS.gdp.maximum
    ),

    inflation: clamp(
      currentInflation + inflationChange,
      ECONOMY_LIMITS.inflation.minimum,
      ECONOMY_LIMITS.inflation.maximum
    ),

    unemployment: clamp(
      currentUnemployment +
        unemploymentChange,
      ECONOMY_LIMITS.unemployment.minimum,
      ECONOMY_LIMITS.unemployment.maximum
    ),
  };
}