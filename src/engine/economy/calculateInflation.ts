import type { GameState } from "../../models/GameState";

const clamp = (
  value: number,
  minimum: number,
  maximum: number,
): number => Math.min(Math.max(value, minimum), maximum);

const round = (value: number): number =>
  Math.round(value * 100) / 100;

export function calculateInflation(
  previousState: GameState,
  updatedState: GameState,
): number {
  const previousGDP = Math.max(
    previousState.economy.gdp,
    1,
  );

  const currentGDP =
    updatedState.economy.gdp;

  const previousInflation =
    previousState.economy.inflation;

  const gdpGrowth =
    ((currentGDP - previousGDP) /
      previousGDP) *
    100;

  const interestRate =
    updatedState.economy.interestRate;

  const governmentShare =
    updatedState.economy.governmentSpending /
    Math.max(currentGDP, 1);

  // Inflation responds gradually to demand.
  const demandPressure =
    gdpGrowth * 0.04;

  const spendingPressure =
    Math.max(0, governmentShare - 0.20) *
    1.5;

  const monetaryPressure =
    (2.5 - interestRate) * 0.08;

  const targetInflation =
    previousInflation +
    demandPressure +
    spendingPressure +
    monetaryPressure;

  // Inflation has inertia—it only moves partway
  // toward the target each quarter.
  const adjustmentSpeed = 0.20;

  const inflation =
    previousInflation +
    (targetInflation -
      previousInflation) *
      adjustmentSpeed;

  return round(
    clamp(inflation, -2, 15),
  );
}