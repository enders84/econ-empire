import type { GameState } from "../../models/GameState";

const clamp = (
  value: number,
  minimum: number,
  maximum: number,
): number => Math.min(Math.max(value, minimum), maximum);

const round = (value: number): number =>
  Math.round(value * 100) / 100;

export function calculateUnemployment(
  previousState: GameState,
  updatedState: GameState,
): number {
  const previousGDP = Math.max(
    previousState.economy.gdp,
    1,
  );

  const currentGDP =
    updatedState.economy.gdp;

  const previousUnemployment =
    previousState.economy.unemployment;

  const gdpGrowth =
    ((currentGDP - previousGDP) /
      previousGDP) *
    100;

  // Okun-style relationship:
  // falling GDP raises unemployment,
  // growing GDP lowers unemployment.
  const growthEffect =
    gdpGrowth * -0.04;

  const interestRateEffect =
    Math.max(
      0,
      updatedState.economy.interestRate - 4,
    ) * 0.02;

  const targetUnemployment =
    previousUnemployment +
    growthEffect +
    interestRateEffect;

  // Unemployment changes gradually rather than
  // jumping immediately after one weak quarter.
  const adjustmentSpeed = 0.35;

  const unemployment =
    previousUnemployment +
    (targetUnemployment -
      previousUnemployment) *
      adjustmentSpeed;

  return round(
    clamp(unemployment, 2, 25),
  );
}