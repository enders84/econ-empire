import type { GameState } from "../../models/GameState";

const clamp = (
  value: number,
  minimum: number,
  maximum: number,
): number => Math.min(Math.max(value, minimum), maximum);

const round = (value: number): number =>
  Math.round(value * 100) / 100;

export function calculateConsumption(
  state: GameState,
): number {
  const {
    gdp,
    consumption: previousConsumption,
    unemployment,
    inflation,
    interestRate,
  } = state.economy;

  const { incomeTax } = state.treasury;

  const taxRate = clamp(incomeTax / 100, 0, 1);

  const disposableIncome =
    gdp * (1 - taxRate);

  const unemploymentEffect = clamp(
    1 - unemployment * 0.01,
    0.7,
    1,
  );

  const inflationEffect = clamp(
    1 - Math.max(0, inflation - 2) * 0.008,
    0.8,
    1,
  );

  const interestRateEffect = clamp(
    1 - Math.max(0, interestRate - 2) * 0.006,
    0.85,
    1,
  );

  const marginalPropensityToConsume = 0.78;

  const targetConsumption =
    disposableIncome *
    marginalPropensityToConsume *
    unemploymentEffect *
    inflationEffect *
    interestRateEffect;

  // Consumption only moves part of the way toward its target each quarter.
  // This prevents GDP and consumption from collapsing in a feedback loop.
  const adjustmentSpeed = 0.15;

  const consumption =
    previousConsumption +
    (targetConsumption - previousConsumption) *
      adjustmentSpeed;

  return round(Math.max(0, consumption));
}